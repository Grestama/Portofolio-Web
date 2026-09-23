"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useStore } from "@/store/useStore";

interface Project3DCardProps {
  image: string;
  title: string;
  index: number;
}

export function Project3DCard({ image, title, index }: Project3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const setCursorState = useStore((state) => state.setCursorState);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limit rotation so it remains extremely elegant and subtle (max 6 degrees)
    const maxRotate = 6;
    const rotateY = ((x - centerX) / centerX) * maxRotate; 
    const rotateX = -((y - centerY) / centerY) * maxRotate;

    setRotation({ x: rotateX, y: rotateY });
    setMousePos({ 
      x: (x / rect.width) * 100, 
      y: (y / rect.height) * 100 
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorState('image');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
    setCursorState('default');
  };

  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <div 
      className="w-full h-full relative group"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative w-full aspect-[16/10] cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)"
        }}
      >
        {/* Layer 4: Frame (Thick Cyan Border) */}
        <div 
          className="absolute inset-[-6px] rounded-3xl pointer-events-none transition-all duration-500 border-[6px] border-[#00E5FF]/80"
          style={{ 
            transform: "translateZ(40px)", // Frame pops out 
            boxShadow: isHovered ? "0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.2)" : "none",
            opacity: isHovered ? 1 : 0.4
          }}
        />

        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden bg-[#050B14] shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Layer 1: Base Background Image */}
          <div 
            className="absolute inset-0 w-full h-full transition-all duration-500"
            style={{ 
              transform: "translateZ(0px) scale(1.05)", // Scale slightly to prevent edge clipping on rotation
              filter: isHovered ? "brightness(0.6) saturate(1.1)" : "brightness(0.9)",
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          {/* Layer 2: Inset / Recessed Shadow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{ 
              transform: "translateZ(-10px)",
              boxShadow: "inset 0 0 60px 10px rgba(0,0,0,0.8)",
              opacity: isHovered ? 1 : 0.4
            }}
          />

          {/* Layer 3: Floating Title Accent */}
          <div 
            className="absolute inset-0 pointer-events-none flex flex-col justify-end items-end p-6"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className={`font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all duration-500 ${isHovered ? 'text-[#00E5FF] opacity-100' : 'text-white opacity-0'}`}>
              {title.toUpperCase()}
            </div>
          </div>

          {/* Layer 5: Hover Dynamic Lighting */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.3), transparent 40%)`,
              transform: "translateZ(50px)"
            }}
          />
          
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              opacity: isHovered ? 0.6 : 0,
              background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,229,255,0.4), transparent 50%)`,
              transform: "translateZ(10px)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
