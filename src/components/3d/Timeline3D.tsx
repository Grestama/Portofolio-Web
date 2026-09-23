"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Sparkles } from "@react-three/drei";
import { experienceConfig } from "@/config/experience";
import { useStore } from "@/store/useStore";
import { useSpring, a } from "@react-spring/three";

export function Timeline3D() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const count = experienceConfig.length;
  
  const experienceFocus = useStore((state) => state.experienceFocus);
  const setExperienceFocus = useStore((state) => state.setExperienceFocus);

  // Generate curved points for orbital trajectory
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      // Create a sweeping curve that snakes down the center
      const x = Math.sin(i * 1.5) * 1.5;
      const y = -i * 6; // Space them out vertically to match the HTML layout
      const z = Math.cos(i * 1.2) * 2 - 1;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [count]);

  // Sync world positions to store so camera can zoom accurately
  useEffect(() => {
    if (experienceFocus.expId !== null) {
      const idx = experienceFocus.expId;
      if (nodeRefs.current[idx]) {
        const worldPos = new THREE.Vector3();
        nodeRefs.current[idx]!.getWorldPosition(worldPos);
        
        // Update if position changed
        if (!experienceFocus.worldPos || 
            Math.abs(experienceFocus.worldPos[0] - worldPos.x) > 0.05 ||
            Math.abs(experienceFocus.worldPos[1] - worldPos.y) > 0.05 ||
            Math.abs(experienceFocus.worldPos[2] - worldPos.z) > 0.05) {
          
          setExperienceFocus({ ...experienceFocus, worldPos: [worldPos.x, worldPos.y, worldPos.z] });
        }
      }
    }
  }, [experienceFocus.expId, experienceFocus.isHover, experienceFocus.active, experienceFocus.worldPos, setExperienceFocus]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Ambient floating
    if (!experienceFocus.active) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group position={[0, (count * 6) / 2, -6]}>
      <group ref={groupRef}>
      {points.map((pos, i) => {
        const isFocused = experienceFocus.expId === i;
        const isClicked = isFocused && experienceFocus.active;
        const isHovered = isFocused && experienceFocus.isHover;
        
        // Determine star size based on focus state and some natural variation
        const baseScale = 1 + (i % 2) * 0.2;
        const targetScale = isClicked ? baseScale * 1.8 : (isHovered ? baseScale * 1.3 : baseScale);
        
        return (
          <NodeStar 
            key={i} 
            position={pos} 
            scale={targetScale}
            isFocused={isFocused}
            isClicked={isClicked}
            ref={(el: THREE.Group | null) => { nodeRefs.current[i] = el; }} 
          />
        );
      })}
      </group>
    </group>
  );
}

// Separate component to handle spring animations for each star
import { forwardRef } from 'react';

const NodeStar = forwardRef<THREE.Group, { position: THREE.Vector3, scale: number, isFocused: boolean, isClicked: boolean }>(({ position, scale, isFocused, isClicked }, ref) => {
  const { animatedScale } = useSpring({
    animatedScale: scale,
    config: { mass: 1, tension: 150, friction: 20 }
  });

  return (
    <a.group ref={ref} position={position as any} scale={animatedScale}>
      {/* Core Star */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Inner Glow */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={isFocused ? 0.8 : 0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Outer Corona */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#00A3FF" transparent opacity={isFocused ? 0.3 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Emit particles when clicked/active */}
      {isClicked && (
        <Sparkles count={20} scale={2} size={3} speed={0.4} color="#00E5FF" opacity={0.6} />
      )}
    </a.group>
  );
});
NodeStar.displayName = 'NodeStar';
