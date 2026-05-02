import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decoding Leadership | LLM-based Political Speech Analysis",
  description:
    "Upload political speeches, transcribe them with Vosk, and get AI-powered multidimensional insights including sentiment, topics, keywords, and promise tracking.",
  keywords: [
    "political speech analysis",
    "LLM analysis",
    "speech-to-text",
    "Vosk",
    "sentiment analysis",
    "NLP",
    "AI",
  ],
  authors: [{ name: "Decoding Leadership" }],
  openGraph: {
    title: "Decoding Leadership",
    description: "LLM-based Multidimensional Analysis of Political Speeches",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-mesh antialiased`}>{children}</body>
    </html>
  );
}
