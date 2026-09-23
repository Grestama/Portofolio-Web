"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import VisualizerBackground from "../3d/VisualizerBackground";
import { CosmicDust } from "../3d/CosmicDust";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

function DeepSpaceBackground() {
  return (
    <group>
      {/* Tiny distant stars (Increased speed for more noticeable blinking/twinkling) */}
      <Stars radius={100} depth={50} count={5000} factor={2} saturation={0} fade speed={3} />
      {/* Closer larger stars for parallax */}
      <Stars radius={50} depth={20} count={1000} factor={4} saturation={1} fade speed={5} />
    </group>
  );
}

export default function GalleryScene() {
  const perfTier = useStore((state) => state.perfTier);
  const dpr = perfTier === 'HIGH' ? [1, 2] : perfTier === 'MEDIUM' ? [1, 1.5] : [1, 1];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        dpr={dpr as [number, number]}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 40, 150]} />
        <DeepSpaceBackground />
        <CosmicDust />
        <VisualizerBackground />
      </Canvas>
    </div>
  );
}

