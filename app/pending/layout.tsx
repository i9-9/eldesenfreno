import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pago en proceso",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PendingLayout({ children }: { children: ReactNode }) {
  return children;
}
