"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: "10+", label: "Projects" },
  { value: "4+", label: "Core Domains" },
  { value: "10+", label: "Technologies" },
  { value: "1", label: "Data-Driven Journey" },
];

function CyberCount({ value, delay }: { value: string, delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" }); // match parent margin

  useEffect(() => {
    if (!inView || !ref.current) return;

    let frame = 0;
    const totalFrames = 40; // slightly longer, ~1.2s at 30fps
    
    const numMatch = value.match(/\d+/);
    const targetNumber = numMatch ? parseInt(numMatch[0]) : 0;
    const suffix = value.replace(/\d+/g, '');

    // Wait for the fade-in animation to mostly finish before scrambling
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        
        if (frame >= totalFrames) {
          clearInterval(interval);
          ref.current!.textContent = value; 
          return;
        }

        const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
        const currentBase = Math.floor(progress * targetNumber);
        
        // Intense noise at the start, tapering off to 0
        const noiseIntensity = 1 - progress;
        const noise = Math.floor(Math.random() * 20 * noiseIntensity);
        
        const displayNum = currentBase + noise;
        ref.current!.textContent = displayNum.toString() + suffix;
      }, 35); 

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [inView, value, delay]);

  return <span ref={ref}>0</span>;
}

export default function StatsSection() {
  return (
    <section className="py-24 relative w-full border-y border-[#00E5FF]/30 bg-[#00E5FF]/[0.05] backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <h4 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 text-glow">
                <CyberCount value={stat.value} delay={0.4 + (index * 0.1)} />
              </h4>
              <p className="text-gray-400 text-sm md:text-base uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#00A3FF] opacity-5 blur-[120px] pointer-events-none rounded-[100%]" />
    </section>
  );
}
