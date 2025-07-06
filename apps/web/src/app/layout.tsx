import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import "@react95/icons/icons.css";
import Providers from "@/components/providers";
import { ScreenFrame } from "@/components/os/frame";
import AudioProvider from "@/components/audio-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "purityos",
  description: "purityos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AudioProvider>
            <ScreenFrame>
              {children}
            </ScreenFrame>
          </AudioProvider>
        </Providers>
      </body>
    </html>
  );
}
