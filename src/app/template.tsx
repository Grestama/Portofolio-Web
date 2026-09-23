"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Fast Cinematic Sequence mirroring the main Loader
    const t1 = setTimeout(() => setStage(1), 100); // Dot appears
    const t2 = setTimeout(() => setStage(2), 600); // Text forms
    const t3 = setTimeout(() => {
      setStage(3); // Disperse
      setTimeout(() => setIsAnimating(false), 800); // Hide completely
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 3 ? 0 : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center flex-col overflow-hidden pointer-events-none"
        >
          {/* Central Dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage >= 1 ? (stage === 3 ? 20 : 1) : 0, 
              opacity: stage >= 1 ? (stage === 3 ? 0 : 1) : 0 
            }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_20px_#00E5FF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* Text Forming */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "1em", scale: 0.8 }}
            animate={{ 
              opacity: stage === 2 ? 1 : 0,
              letterSpacing: stage === 2 ? "0.2em" : "1em",
              scale: stage === 2 ? 1 : 1.2
            }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-display font-bold text-2xl md:text-4xl tracking-widest"
          >
            GRESTAMA
          </motion.div>
        </motion.div>
      )}

      {children}
    </>
  );
}
