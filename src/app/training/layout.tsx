import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: "Training",
  description:
    "Webcam-based laparoscopic training sessions for deliberate instrument practice.",
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppChrome>{children}</AppChrome>;
}
