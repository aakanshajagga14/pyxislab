import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: "Assessment",
  description:
    "Timed FLS assessment sessions with webcam-based laparoscopic instrument tracking.",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppChrome>{children}</AppChrome>;
}
