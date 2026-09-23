"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useStore } from "@/store/useStore";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  hoverState?: 'hover' | 'external' | 'project';
  hoverText?: string;
}

export default function Magnetic({ children, strength = 0.3, hoverState = 'hover', hoverText = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const setCursorState = useStore((state) => state.setCursorState);
  const isMobile = useStore((state) => state.isMobile);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    mouseX.set(middleX * strength);
    mouseY.set(middleY * strength);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
    setCursorState('default');
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setCursorState(hoverState, hoverText);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x, y }}
      className="inline-block relative"
    >
      {children}
    </motion.div>
  );
}
