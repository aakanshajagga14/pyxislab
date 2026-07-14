import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { PerformanceScores } from "@/lib/types";
import type { FlsSessionMode, FlsTaskId } from "@/lib/laparoscopic/types";
import { TASK_META } from "@/lib/laparoscopic/flsBenchmarks";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a laparoscopic surgical training coach. Given a trainee's session metrics (0-100 scale), write a concise, specific 3-4 sentence summary: what they did well, what to focus on next, and one concrete actionable tip tied to the lowest-scoring metric. No generic encouragement, no emoji, no vague praise. Reference the actual metric names. Keep clinical, direct tone — not a motivational coach.`;

const SCORE_KEYS: (keyof PerformanceScores)[] = [
  "precision",
  "stability",
  "motionControl",
  "proceduralConsistency",
  "smoothness",
  "controlRating",
];

export interface ReportFeedbackRequest {
  scores: PerformanceScores;
  taskId: FlsTaskId;
  mode: FlsSessionMode;
}

export interface ReportFeedbackResponse {
  summary: string | null;
  unavailable?: boolean;
  reason?: string;
}

function isValidScores(scores: unknown): scores is PerformanceScores {
  if (!scores || typeof scores !== "object") return false;
  const s = scores as Record<string, unknown>;
  return SCORE_KEYS.every(
    (k) => typeof s[k] === "number" && Number.isFinite(s[k] as number)
  );
}

function lowestMetric(scores: PerformanceScores): keyof PerformanceScores {
  return SCORE_KEYS.reduce((lowest, key) =>
    scores[key] < scores[lowest] ? key : lowest
  );
}

function buildUserPrompt(body: ReportFeedbackRequest): string {
  const { scores, taskId, mode } = body;
  const taskName = TASK_META[taskId]?.name ?? taskId;
  const lowest = lowestMetric(scores);

  return [
    `Task: ${taskName} (${taskId})`,
    `Mode: ${mode}`,
    `Metrics (0-100):`,
    ...SCORE_KEYS.map((k) => `- ${k}: ${Math.round(scores[k])}`),
    `Lowest metric: ${lowest} (${Math.round(scores[lowest])})`,
  ].join("\n");
}

function unavailable(
  reason: string,
  status = 200
): NextResponse<ReportFeedbackResponse> {
  return NextResponse.json(
    { summary: null, unavailable: true, reason },
    { status }
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return unavailable("OPENAI_API_KEY is not configured");
  }

  let body: ReportFeedbackRequest;
  try {
    body = (await request.json()) as ReportFeedbackRequest;
  } catch {
    return unavailable("Invalid JSON body", 400);
  }

  if (
    !body?.taskId ||
    !body?.mode ||
    (body.mode !== "training" && body.mode !== "assessment") ||
    !isValidScores(body.scores)
  ) {
    return unavailable("Invalid request: scores, taskId, and mode required", 400);
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 180,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(body) },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!summary) {
      return unavailable("Empty model response");
    }

    return NextResponse.json({ summary } satisfies ReportFeedbackResponse);
  } catch {
    // Do not log full request/response bodies (session metrics).
    return unavailable("OpenAI request failed");
  }
}
