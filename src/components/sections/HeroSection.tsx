"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import Magnetic from "@/components/interaction/Magnetic";
import { siteConfig } from "@/config/site";

export default function HeroSection() {
  const setCursorState = useStore((state) => state.setCursorState);

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center mt-20">


        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {siteConfig.name.split(' ')[0]}<br />
          <span>
            {siteConfig.name.split(' ').slice(1).join(' ')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Magnetic strength={0.3}>
            <a 
              href="#projects" 
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300 block"
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
            >
              View Projects
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a 
              href="#contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm block"
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
            >
              Let&apos;s Connect
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}
