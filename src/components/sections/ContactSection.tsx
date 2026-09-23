"use client";

import { motion } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { assets } from "@/config/assets";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function ContactSection() {
  return (
    <section id="contact" className="pt-32 relative w-full border-t border-white/5 bg-[#050505]">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-8xl font-display font-bold leading-tight mb-12">
            HAVE AN IDEA?<br />
            <span className="text-[#00E5FF]">LET&apos;S TALK.</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 hover:border-[#00A3FF] hover:bg-[#00A3FF]/10 transition-colors flex items-center gap-2 text-sm">
              <LinkedinIcon className="w-4 h-4" /> LinkedIn →
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
              <GithubIcon className="w-4 h-4" /> GitHub →
            </a>
            <a href="mailto:contact@grestama.com" className="px-6 py-3 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-colors flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4" /> Email Me →
            </a>
            <a href="/cv" className="px-6 py-3 rounded-full border border-white/20 hover:border-white transition-colors flex items-center gap-2 text-sm group">
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> View CV
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 border-t border-white/5 bg-[#02050A]">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 md:w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />
        
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Left Column: Branding */}
            <div className="text-center md:text-left space-y-2">
              <h5 className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-wide">
                GRESTAMA NAUFAL TSABIT
              </h5>
              <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-mono">
                Data Science Student <span className="text-[#00E5FF] mx-1">|</span> AI <span className="text-[#00E5FF] mx-1">|</span> Tech
              </p>
            </div>
            
            {/* Middle Column: Social Links */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00E5FF] text-xs uppercase tracking-widest font-medium transition-all hover:scale-105">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00E5FF] text-xs uppercase tracking-widest font-medium transition-all hover:scale-105">LinkedIn</a>
              <a href="mailto:contact@grestama.com" className="text-gray-400 hover:text-[#00E5FF] text-xs uppercase tracking-widest font-medium transition-all hover:scale-105">Email</a>
            </div>
            
            {/* Right Column: Copyright & Status */}
            <div className="text-center md:text-right space-y-3 flex flex-col md:items-end items-center">
              <div className="flex items-center gap-2 bg-[#00E5FF]/10 px-3 py-1.5 rounded-full border border-[#00E5FF]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span className="text-[#00E5FF] text-[10px] font-mono uppercase tracking-widest">Available for work</span>
              </div>
              <p className="text-gray-600 text-xs font-mono">
                &copy; {new Date().getFullYear()} Grestama.<br className="hidden md:block" /> All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
