import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Review completed Pyxis Lab training and assessment session reports.",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppChrome>{children}</AppChrome>;
}
