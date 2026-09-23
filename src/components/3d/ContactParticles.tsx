"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

export function ContactParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = useStore((state) => state.isMobile);
  const toggles = useStore((state) => state.toggles);

  const count = isMobile ? 1500 : 5000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Swirling galaxy/vortex shape
      const radius = Math.random() * 8 + 1;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4 * (1 / radius); // Taller at center
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mix = Math.random();
      if (mix > 0.8) color.set("#FFFFFF");
      else if (mix > 0.4) color.set("#00E5FF");
      else color.set("#00A3FF");

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.visible = toggles.particles;
    if (!toggles.particles) return;

    // Slowly rotate the entire vortex
    pointsRef.current.rotation.y += delta * 0.1;
    // Add a slight tilt
    pointsRef.current.rotation.x = 0.2;
    pointsRef.current.rotation.z = -0.1;
  });

  return (
    <group position={[0, -2, -5]}>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={isMobile ? 0.05 : 0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
