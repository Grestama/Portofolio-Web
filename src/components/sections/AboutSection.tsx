"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 relative w-full border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Large Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
              DATA<br />
              <span className="text-gray-500">IS MORE</span><br />
              <span className="text-[#00E5FF]">THAN NUMBERS.</span>
            </h2>
          </motion.div>

          {/* Right: Personal Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-lg md:text-xl text-gray-400 font-light leading-relaxed"
          >
            <p>
              I am an undergraduate Data Science student at Telkom University with a strong interest in <span className="text-white font-medium">data analytics, machine learning, artificial intelligence</span>, and building data-driven applications.
            </p>
            <p>
              Every dataset contains patterns, insights, and stories waiting to be discovered. My goal is to extract those insights and build intelligent digital systems that solve real-world problems.
            </p>
            <p>
              Currently, I am focusing on deepening my knowledge in Neural Networks, mastering modern web development frameworks to present data effectively, and exploring how AI can transform our daily lives.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
    </section>
  );
}
