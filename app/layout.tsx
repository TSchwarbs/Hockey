import type { Metadata } from "next";
import "./globals.css";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

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
    <html
      lang="en"
      className={cn(
        "antialiased",
        inter.variable,
        bebasNeue.variable,
        jetbrainsMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
