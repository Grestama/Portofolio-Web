"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function CustomCursor() {
  const cursorState = useStore((state) => state.cursorState);
  const cursorText = useStore((state) => state.cursorText);
  const isMobile = useStore((state) => state.isMobile);
  const toggles = useStore((state) => state.toggles);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible, isMobile]);

  if (isMobile || !toggles.cursorEffects) return null;

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "#00E5FF",
      mixBlendMode: "normal" as any,
      opacity: 1,
    },
    hover: {
      width: 24,
      height: 24,
      backgroundColor: "rgba(0, 229, 255, 0.2)",
      border: "1px solid rgba(0, 229, 255, 0.8)",
      mixBlendMode: "normal" as any,
    },
    project: {
      width: 24,
      height: 24,
      backgroundColor: "#00E5FF",
      mixBlendMode: "normal" as any,
    },
    image: {
      width: 24,
      height: 24,
      backgroundColor: "#00E5FF",
      mixBlendMode: "normal" as any,
    },
    external: {
      width: 24,
      height: 24,
      backgroundColor: "transparent",
      border: "1px solid #FFF",
      mixBlendMode: "normal" as any,
    },
    drag: {
      width: 24,
      height: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "1px dashed rgba(255, 255, 255, 0.8)",
      mixBlendMode: "normal" as any,
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center text-center overflow-hidden"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
      }}
      variants={variants}
      animate={cursorState}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {cursorText && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-black text-[10px] font-bold tracking-widest whitespace-nowrap"
          style={{ color: cursorState === 'external' ? 'white' : 'black' }}
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
