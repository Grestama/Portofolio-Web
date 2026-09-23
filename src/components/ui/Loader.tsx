"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function Loader() {
  const isLoading = useStore((state) => state.isLoading);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Cinematic Loading Sequence
    const t1 = setTimeout(() => setStage(1), 500); // Dot appears
    const t2 = setTimeout(() => setStage(2), 1500); // Text forms
    const t3 = setTimeout(() => {
      setStage(3); // Disperse
      setTimeout(() => setIsLoading(false), 800);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center flex-col overflow-hidden"
        >
          {/* Central Dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage >= 1 ? (stage === 3 ? 20 : 1) : 0, 
              opacity: stage >= 1 ? (stage === 3 ? 0 : 1) : 0 
            }}
            transition={{ duration: 1, ease: "backOut" }}
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
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-display font-bold text-2xl md:text-4xl tracking-widest"
          >
            GRESTAMA
          </motion.div>
          
          <button 
            onClick={() => setIsLoading(false)}
            className="absolute bottom-10 text-gray-600 text-xs tracking-widest hover:text-white transition-colors"
          >
            SKIP
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
