import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pago no completado",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FailureLayout({ children }: { children: ReactNode }) {
  return children;
}
