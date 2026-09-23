"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, GitBranch, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { projectsConfig } from "@/config/projects";
import { useEffect } from "react";

export default function ProjectModal() {
  const focusedProjectId = useStore((state) => state.focusedProjectId);
  const setFocusedProjectId = useStore((state) => state.setFocusedProjectId);
  const setCursorState = useStore((state) => state.setCursorState);
  const project = projectsConfig.find(p => p.id === focusedProjectId);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (focusedProjectId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [focusedProjectId]);

  return (
    <AnimatePresence>
      {focusedProjectId !== null && project && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setFocusedProjectId(null)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#0A0F16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setFocusedProjectId(null)}
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-gray-900 border-b md:border-b-0 md:border-r border-white/10">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F16] to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <span className="text-[#00E5FF] text-sm tracking-widest uppercase block mb-4">{project.category}</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">{project.title}</h2>
              
              <div className="space-y-6 text-gray-400 leading-relaxed mb-10">
                <p className="text-lg text-white">{project.description}</p>
                {/* Additional simulated content for Case Study feel */}
                <p>
                  <strong>The Challenge:</strong> Building a scalable solution that integrates complex data sets while maintaining high performance. 
                  This project required deep research into optimal algorithms and careful consideration of edge cases.
                </p>
                <p>
                  <strong>The Solution:</strong> Leveraging {project.technologies.slice(0, 3).join(', ')} to create a robust architecture. 
                  The end result improved processing time significantly and provided intuitive insights.
                </p>
              </div>

              <div className="mb-10">
                <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    onMouseEnter={() => setCursorState('hover')}
                    onMouseLeave={() => setCursorState('default')}
                  >
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-6 py-3 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    onMouseEnter={() => setCursorState('hover')}
                    onMouseLeave={() => setCursorState('default')}
                  >
                    Source Code
                    <GitBranch className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
