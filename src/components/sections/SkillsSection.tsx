"use client";

import { useStore } from "@/store/useStore";
import { skillsConfig } from "@/config/skills";

export default function SkillsSection() {
  const isMobile = useStore((state) => state.isMobile);
  const exploreMode = useStore((state) => state.exploreMode);
  const setExploreMode = useStore((state) => state.setExploreMode);
  const skillFocus = useStore((state) => state.skillFocus);
  
  const focusedNode = skillFocus.skillId 
    ? skillsConfig.find(s => s.id === skillFocus.skillId) 
    : null;

  return (
    <section id="skills" className="relative w-full min-h-screen border-t border-white/5 pointer-events-none flex flex-col justify-center select-none">
      
      {/* Sticky container for UI overlays */}
      <div id="skills-sticky" className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none relative">
        
        {/* Header - Positioned at top left */}
        <div className="absolute top-24 left-6 md:left-12 pointer-events-none z-10">
          <h2 className="text-sm font-bold tracking-widest text-[#00E5FF] uppercase mb-2">Technical Arsenal</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold">Skills & Tech Stack</h3>
        </div>

        {/* Left Panel */}
        <div className="hidden md:flex flex-col gap-6 text-sm glass-panel p-6 rounded-xl w-48 pointer-events-auto opacity-80 hover:opacity-100 transition-opacity absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 mt-10">
          <h4 className="font-bold text-gray-400 mb-2">TECHNICAL ARSENAL</h4>
          <div>
            <div className="text-2xl font-bold text-white">08+</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Core Skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">15+</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Technologies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00E5FF]">04</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Domains</div>
          </div>
        </div>

        {/* Right Panel (Dynamic Skill Pop-up) */}
        {focusedNode && (
          <div className="hidden md:flex flex-col text-sm bg-[#050A10]/95 backdrop-blur-xl border border-[#00E5FF]/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] p-6 rounded-xl w-80 pointer-events-auto absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 mt-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Tech corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00E5FF] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00E5FF] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00E5FF] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00E5FF] rounded-br-xl" />

            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-400 tracking-widest uppercase text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00E5FF] animate-pulse"></span>
                NODE INSPECTION
              </h4>
            </div>
            
            <h5 className="text-xl font-bold text-[#00E5FF] mb-2 uppercase">{focusedNode.label}</h5>
            <div className="text-[10px] text-[#00A3FF] font-mono mb-4 border-b border-[#00E5FF]/20 pb-2">
              SYS_NODE_ID // {focusedNode.id.toUpperCase()}
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {focusedNode.description}
            </p>

            <h6 className="text-xs text-gray-500 uppercase tracking-wider mb-3 border-b border-white/10 pb-1">Capabilities</h6>
            <div className="space-y-2 mb-6">
              {focusedNode.subSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300 text-xs font-mono">
                  <span className="w-1.5 h-1.5 bg-[#00A3FF] rounded-sm" />
                  {skill}
                </div>
              ))}
            </div>
            
            {focusedNode.relatedProjects.length > 0 && (
              <div>
                <button 
                  className="w-full text-xs font-bold tracking-widest uppercase border border-white/20 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 py-2.5 rounded text-gray-300 hover:text-[#00E5FF] transition-all"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View {focusedNode.relatedProjects.length} Related Projects →
                </button>
              </div>
            )}

            <div className="mt-4 pt-2 border-t border-[#00E5FF]/20 text-[9px] text-gray-500 font-mono text-center">
              DATA LINK ESTABLISHED
            </div>
          </div>
        )}

        {/* Bottom Controls removed as requested */}
      </div>

      {/* Accessible DOM Fallback (Screen Readers & Mobile) */}
      <div className="sr-only">
        {isMobile && (
          <div className="grid grid-cols-2 gap-4">
            {skillsConfig.filter(s => s.category !== 'core').map((skill) => (
              <div key={skill.id} className="p-4 rounded-xl bg-gray-900 border border-white/10 text-center">
                <span className="text-[#00E5FF] font-medium">{skill.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Screen reader only tree */}
        <div>
          <h3>Knowledge Graph Outline</h3>
          <ul>
            {skillsConfig.map(node => (
              <li key={node.id}>
                {node.label} ({node.category})
                <ul>
                  {node.subSkills.map(sub => <li key={sub}>{sub}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
