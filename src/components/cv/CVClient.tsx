"use client";

import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { CosmicDust } from "@/components/3d/CosmicDust";
import { motion } from "framer-motion";
import Magnetic from "@/components/interaction/Magnetic";
import { useStore } from "@/store/useStore";

function DeepSpaceBackground() {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={2} saturation={0} fade speed={3} />
      <Stars radius={50} depth={20} count={1000} factor={4} saturation={1} fade speed={5} />
    </group>
  );
}

export default function CVClient() {
  const setCursorState = useStore((state) => state.setCursorState);
  const perfTier = useStore((state) => state.perfTier);
  const dpr = perfTier === 'HIGH' ? [1, 2] : [1, 1];

  return (
    <main className="min-h-screen bg-[#02050A] relative overflow-hidden flex flex-col items-center py-20 px-6 font-mono">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 5, 20], fov: 60 }}
          dpr={dpr as [number, number]}
          gl={{ powerPreference: "high-performance", antialias: false }}
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 40, 150]} />
          <DeepSpaceBackground />
          <CosmicDust />
        </Canvas>
      </div>

      {/* Glow overlays */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00E5FF] opacity-5 blur-[150px] pointer-events-none rounded-full z-0" />
      
      {/* Header / Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl flex items-center justify-between mb-8 relative z-10"
      >
        <Magnetic strength={0.2}>
          <Link 
            href="/"
            className="flex items-center gap-3 text-gray-400 hover:text-[#00E5FF] transition-colors font-display text-sm uppercase tracking-[0.2em] group"
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> 
            BACK TO TERMINAL
          </Link>
        </Magnetic>
        
        <Magnetic strength={0.2}>
          <a 
            href="/cv.pdf" 
            download="Grestama_Naufal_Tsabit_CV.pdf"
            className="flex items-center gap-3 px-6 py-2.5 rounded-none border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all font-display text-sm uppercase tracking-wider relative overflow-hidden"
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
          >
            {/* Cyberpunk corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00E5FF]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00E5FF]" />
            <Download className="w-4 h-4" /> DOWNLOAD PDF
          </a>
        </Magnetic>
      </motion.div>

      {/* Cyberpunk PDF Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl h-[85vh] relative z-10 p-[2px] overflow-hidden"
      >
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF] via-transparent to-[#00E5FF] opacity-50" />
        
        <div className="w-full h-full bg-[#050B14] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 border border-[#00E5FF]/20">
          
          {/* High-tech Header */}
          <div className="h-12 w-full border-b border-[#00E5FF]/30 bg-[#00E5FF]/5 flex items-center px-6 justify-between backdrop-blur-md relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50" />
            
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#00E5FF]/50" />
                <div className="w-2 h-2 bg-[#00E5FF]/50" />
                <div className="w-2 h-2 bg-[#00E5FF]" />
              </div>
              <div className="font-display text-[10px] md:text-xs text-[#00E5FF] tracking-[0.3em] uppercase">
                DATA_MODULE // RESUME.DAT
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
              <div className="font-mono text-[10px] text-[#00E5FF] uppercase tracking-widest hidden md:block">
                SYSTEM ONLINE
              </div>
            </div>
          </div>

          {/* Actual PDF Iframe */}
          <div className="flex-1 w-full relative bg-gray-900/50">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
              <div className="w-16 h-16 border-2 border-transparent border-t-[#00E5FF] border-b-[#00E5FF] rounded-full animate-spin mb-4" />
              <span className="font-display text-xs text-[#00E5FF] uppercase tracking-[0.2em] animate-pulse">DECRYPTING DATA...</span>
            </div>
            
            <iframe 
              src="/cv.pdf#toolbar=0&navpanes=0&view=FitH" 
              className="w-full h-full border-none relative z-10"
              title="Curriculum Vitae"
            />
            {/* The mix-blend-screen and grayscale filters will make a standard black/white PDF look like a futuristic hologram terminal! */}
          </div>

          {/* Glowing Frame Border Effects */}
          <div className="absolute inset-0 border-[4px] border-[#00E5FF]/10 pointer-events-none" />
        </div>
      </motion.div>
      
    </main>
  );
}
