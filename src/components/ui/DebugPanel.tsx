"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

import { Settings } from "lucide-react";

export function DebugPanel() {
  const activeSection = useStore((state) => state.activeSection);
  const perfTier = useStore((state) => state.perfTier);
  const debugMode = useStore((state) => state.debugMode);
  const setDebugMode = useStore((state) => state.setDebugMode);
  const toggles = useStore((state) => state.toggles);
  const setToggle = useStore((state) => state.setToggle);
  const isMobile = useStore((state) => state.isMobile);
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!debugMode) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      frameCount++;

      if (now >= lastTime + 1000) {
        setFps(frameCount);
        setFrameTime(1000 / frameCount);
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(loop);
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress((window.scrollY / maxScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    const rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [debugMode]);

  // Toggle debug panel with Ctrl+D or something similar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setDebugMode(!debugMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode, setDebugMode]);

  if (isMobile) return null;

  if (!debugMode) {
    return (
      <button 
        onClick={() => setDebugMode(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-[#00E5FF]/50 p-3 rounded-full text-gray-400 hover:text-[#00E5FF] transition-all duration-300 shadow-lg group"
        title="Open Debug Panel (Ctrl+D)"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs font-mono w-64 shadow-2xl text-white">
      <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
        <h4 className="text-[#00E5FF] font-bold tracking-widest uppercase">Debug Panel</h4>
        <button onClick={() => setDebugMode(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">FPS</span>
          <span className={fps < 30 ? "text-red-400" : fps < 50 ? "text-yellow-400" : "text-green-400"}>{fps}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Frame Time</span>
          <span>{frameTime.toFixed(1)}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Scroll</span>
          <span>{scrollProgress.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Section</span>
          <span className="text-[#00A3FF]">{activeSection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Quality Tier</span>
          <span>{perfTier}</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/20 pt-4">
        <h5 className="text-gray-500 uppercase tracking-wider text-[10px] mb-2">Toggles</h5>
        
        {Object.entries(toggles).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between cursor-pointer group">
            <span className="text-gray-300 capitalize group-hover:text-white transition-colors">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-[#00E5FF]' : 'bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${value ? 'translate-x-4.5 left-[1px]' : 'translate-x-0.5'}`} />
            </div>
            {/* Hidden actual checkbox to make it accessible although it's a dev tool */}
            <input type="checkbox" className="hidden" checked={value} onChange={() => setToggle(key as any, !value)} />
          </label>
        ))}
      </div>
    </div>
  );
}
