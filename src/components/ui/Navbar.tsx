"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Download, Sparkles } from "lucide-react";
import { assets } from "@/config/assets";
import Magnetic from "@/components/interaction/Magnetic";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const setCursorState = useStore((state) => state.setCursorState);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent select-none",
        scrolled
          ? "bg-[#0A0F16]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-black/50"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Magnetic key={link.name} strength={0.2}>
              <Link
                href={link.href}
                className="text-sm font-bold tracking-wide text-gray-300 hover:text-white transition-colors duration-200 py-2"
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={() => setCursorState('default')}
              >
                {link.name}
              </Link>
            </Magnetic>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Magnetic strength={0.3}>
            <Link
              href="/cv"
              className="flex items-center gap-2 text-sm font-medium border border-white/20 hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all duration-300 rounded-full px-5 py-2 group"
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
            >
              CV
              <Download className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>

          {/* Special Gallery Button */}
          <Magnetic strength={0.3}>
            <Link
              href="/gallery"
              className="flex items-center gap-2 text-sm font-bold bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-300 rounded-full px-6 py-2 group shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
            >
              <Sparkles className="w-4 h-4" />
              Gallery
            </Link>
          </Magnetic>
        </div>
      </div>
    </nav>
  );
}
