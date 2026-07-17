import type { Metadata } from "next";
import { Vina_Sans } from "next/font/google";
import "./globals.css";

const vinaSans = Vina_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vina",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gena Medure — Media Kit",
  description:
    "Lifestyle and home creator based in Ventura, CA. Brand kit and media for collaborations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vinaSans.variable}>
      <body className="min-h-full bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
