import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/themeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Veritas AI — Autonomous Research Platform",
  description:
    "A futuristic multi-agent research workspace that verifies information before generating trustworthy reports.",
=======
  title: "Veriq — Autonomous Multi-Agent Fact Verification",
  description: "Verify any fact with multi-agent AI. Veriq orchestrates 8 autonomous AI nodes to search primary literature, extract evidence, detect contradictions, and synthesize verified reports.",
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
<<<<<<< HEAD
      <head>
        {/* Inline script to apply stored theme before paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('veritas-theme');
                if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>
=======
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
