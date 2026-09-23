"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { Volume2, VolumeX } from "lucide-react";
import Magnetic from "@/components/interaction/Magnetic";
import { audioManager } from "@/lib/audioManager";

export default function AudioEcosystem() {
  const audioEnabled = useStore((state) => state.audioEnabled);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);
  const setCursorState = useStore((state) => state.setCursorState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object once
    if (!audioRef.current) {
      // Looks for a file named background.mp3 in public/audio/
      const audio = new Audio('/audio/background.mp3');
      audio.loop = true;
      audio.volume = 0.5; // Adjust default volume here
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }

    if (audioEnabled) {
      if (audioRef.current) {
        audioManager.init(audioRef.current);
        audioManager.resume();
      }
      
      // Attempt to play
      audioRef.current.play().catch(err => {
        console.warn("Please place 'background.mp3' in the public/audio folder.", err);
        // Auto-disable if the file is missing or blocked by browser
        setAudioEnabled(false);
        alert("File suara belum tersedia. Silakan masukkan file 'background.mp3' ke folder 'public/audio/'.");
      });
    } else {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [audioEnabled, setAudioEnabled]);

  return (
    <div className="fixed bottom-4 right-20 z-[9999]">
      <Magnetic strength={0.2}>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          onMouseEnter={() => setCursorState('hover')}
          onMouseLeave={() => setCursorState('default')}
          className={`p-3 rounded-full border transition-all duration-500 backdrop-blur-md flex items-center justify-center ${
            audioEnabled 
              ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
              : 'bg-black/50 border-white/10 hover:border-[#00E5FF]/50 text-gray-400 hover:text-[#00E5FF]'
          }`}
          title={audioEnabled ? "Mute audio" : "Play music (public/audio/background.mp3)"}
          aria-label={audioEnabled ? "Mute audio" : "Enable immersive audio"}
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </Magnetic>
    </div>
  );
}

