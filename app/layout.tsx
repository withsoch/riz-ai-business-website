import type { Metadata } from "next";
import { Archivo, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChromeGate from "@/components/ChromeGate";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/contexts/audio-context";
import { AudioPlayer } from "@/components/AudioPlayer";

// v3 type stack, lifted from the design preview: Archivo for display,
// Inter Tight for body, IBM Plex Mono for figures and labels.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-intertight",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plexmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rizwan Mahmood · Operator · Builder · Tallinn",
  description:
    "I help business owners think clearly enough that automation actually works, and I build the systems that prove it.",
  icons: {
    icon: "/favicon/v1-coral-circle-serif-icon-black-R.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${interTight.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <AudioProvider>
          <ChromeGate slot="nav">
            <Navbar />
          </ChromeGate>
          <main className="flex-1">{children}</main>
          <ChromeGate slot="footer">
            <Footer />
          </ChromeGate>
          <AudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
