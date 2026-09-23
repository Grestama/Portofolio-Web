"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import Magnetic from "@/components/interaction/Magnetic";
import { projectsConfig } from "@/config/projects";
import { Project3DCard } from "@/components/ui/Project3DCard";

export default function ProjectsSection() {
  const isMobile = useStore((state) => state.isMobile);
  const setCursorState = useStore((state) => state.setCursorState);
  const setFocusedProjectId = useStore((state) => state.setFocusedProjectId);
  const projectFilter = useStore((state) => state.projectFilter);
  const setProjectFilter = useStore((state) => state.setProjectFilter);

  const displayedProjects = projectFilter 
    ? projectsConfig.filter(p => p.technologies.includes(projectFilter))
    : projectsConfig;

  return (
    <section id="projects" className="pt-16 pb-32 relative w-full border-t border-white/5 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-sm font-bold tracking-widest text-[#00E5FF] uppercase">Featured Work</h2>
              {projectFilter && (
                <button 
                  onClick={() => setProjectFilter(null)}
                  className="px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs border border-[#00E5FF]/30 hover:bg-[#00E5FF]/30 transition-colors"
                >
                  Clear Filter: {projectFilter} ✕
                </button>
              )}
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-bold">Projects</h3>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base">
            Showcasing real-world applications of data science, machine learning, and modern web technologies.
          </p>
        </div>

        <div className="space-y-32">
          <AnimatePresence>
            {displayedProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center py-20 text-gray-500"
              >
                No projects found matching the current filter.
              </motion.div>
            ) : (
              displayedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col gap-8 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center`}
            >
              {/* Image Container - Now rendered in DOM with CSS 3D for a premium physical card effect */}
              <div 
                id={`project-image-${project.id}`}
                className="w-full lg:w-3/5 relative overflow-hidden rounded-3xl aspect-[16/10]"
              >
                <Project3DCard image={project.image} title={project.title} index={index} />
              </div>

              {/* Content */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center px-4 lg:px-12">
                <span className="text-5xl md:text-7xl font-display font-bold text-[#00A3FF]/80 mb-4">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[#00E5FF] text-sm tracking-widest uppercase mb-4">{project.category}</span>
                <h4 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h4>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-4 py-2 rounded-full border border-white/20 text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <Magnetic strength={0.2} hoverState="project">
                  <button
                    onClick={() => setFocusedProjectId(project.id)}
                    className="inline-flex items-center gap-3 text-white hover:text-[#00E5FF] transition-colors group/btn w-max pb-2 border-b border-white/20 hover:border-[#00E5FF]"
                    onMouseEnter={() => setCursorState('hover')}
                    onMouseLeave={() => setCursorState('default')}
                  >
                    View Project Details
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </Magnetic>
              </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
