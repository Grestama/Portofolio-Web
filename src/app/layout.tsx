import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/interaction/SmoothScroll";
import CustomCursor from "@/components/interaction/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import { DebugPanel } from "@/components/ui/DebugPanel";
import ProjectModal from "@/components/sections/ProjectModal";
import AudioEcosystem from "@/components/interaction/AudioEcosystem";
import MatrixRain from "@/components/interaction/MatrixRain";
import ErrorCatcher from "@/components/ErrorCatcher";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grestama | Data Science Portfolio",
  description: "Personal Data Science Portfolio of Grestama Naufal Tsabit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${geist.variable} font-sans antialiased bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black`}>
        <SmoothScroll>
          <CustomCursor />
          <DebugPanel />
          <AudioEcosystem />
          <ProjectModal />
          <MatrixRain />
          <ErrorCatcher />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
