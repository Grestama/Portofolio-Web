"use client";

import { motion } from "framer-motion";
import { experienceConfig } from "@/config/experience";

export default function ExperienceSection() {
  return (
    <section 
      id="experience" 
      className="py-20 md:py-32 relative w-full bg-transparent border-t border-white/5"
    >
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">Experience & Education</h2>
        </div>

        {/* STANDARD CONTAINER (NO INTERNAL SCROLL) */}
        <div className="relative w-full max-w-5xl mx-auto overflow-x-hidden p-4 md:py-12 pointer-events-auto">
          
          {/* Orbital Track Background */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] pointer-events-none">
            {/* Base subtle straight line as fallback/guide */}
            <div className="w-full h-full bg-white/10" />
          </div>

          <div className="relative w-full py-10 space-y-32">
            {experienceConfig.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className={`relative flex w-full items-center justify-center md:justify-start ${isLeft ? '' : 'md:!justify-end'}`}
                >
                  {/* Central Node / Star (Vertex) - hidden on mobile to prevent overlap */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00E5FF]" />
                    </div>
                  </div>

                  {/* Connection to the central line (Edge) - hidden on mobile */}
                  <div 
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[7.5%] md:w-[8%] h-[2px] bg-[#00E5FF]/40 z-10 pointer-events-none ${isLeft ? 'right-1/2' : 'left-1/2'}`} 
                  />

                  {/* HTML Card */}
                  <div 
                    className={`w-[85%] md:w-[42%] backdrop-blur-xl bg-[#0A0F16]/60 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A0F16]/80 hover:scale-[1.02] hover:border-[#00E5FF] hover:shadow-[0_0_0_3px_#00E5FF,0_0_30px_rgba(0,229,255,0.4)] cursor-default`}
                  >
                    <span className="text-[#00E5FF] font-mono text-sm md:text-base font-bold tracking-wider block mb-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                      {exp.period}
                    </span>
                    <h4 className="text-xl md:text-2xl font-display font-bold text-white mb-1">{exp.role}</h4>
                    <h5 className="text-base md:text-lg text-[#00E5FF]/80 mb-4 font-medium">{exp.organization}</h5>
                    <ul className="text-gray-300 text-sm md:text-base leading-relaxed list-disc list-inside space-y-1.5">
                      {exp.responsibilities.map((resp: string, i: number) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
