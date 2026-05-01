import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "[BUSINESS NAME]",
  description: "Professional skate sharpening service. Book your drop-off online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable)} suppressHydrationWarning>
      <body className="bg-brand-bg text-[#1A1A1A]">{children}</body>
    </html>
  );
}
