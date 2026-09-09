import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slime Haven",
  description: "Slime Haven world prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistMono.variable} h-dvh w-screen overflow-hidden p-0`}>
      <body className="m-0 h-dvh w-screen overflow-hidden p-0">{children}</body>
    </html>
  );
}
