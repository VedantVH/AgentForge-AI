import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgentForge OS — Private AI Operating System | AMD Radeon",
  description:
    "AgentForge OS: The first local AI Operating System powered by AMD Radeon GPUs & ROCm 6.2. Multi-agent reasoning, planning, memory, and tool execution — 100% private.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
