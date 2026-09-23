"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

export function TechAsteroids() {
  const perfTier = useStore((state) => state.perfTier);
  const isHigh = perfTier === 'HIGH';
  
  const asteroidCount = isHigh ? 15 : 6;
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random data for each asteroid
  const asteroids = useMemo(() => {
    const data = [];
    for (let i = 0; i < asteroidCount; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 120 - 20, // Spread across the long Y scroll
          -10 - Math.random() * 20
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ),
        scale: Math.random() * 1.5 + 0.5,
        type: Math.floor(Math.random() * 3) // 0: Icosahedron, 1: Octahedron, 2: Torus
      });
    }
    return data;
  }, [asteroidCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slowly rotate the entire group for subtle ambient movement
    groupRef.current.rotation.y += delta * 0.05;
    
    // Rotate individual asteroids
    groupRef.current.children.forEach((child, i) => {
      const data = asteroids[i];
      if (data) {
        child.rotation.x += data.rotSpeed.x * delta;
        child.rotation.y += data.rotSpeed.y * delta;
        child.rotation.z += data.rotSpeed.z * delta;
        
        // Gentle bobbing effect
        child.position.y += Math.sin(state.clock.elapsedTime + i) * delta * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((ast, i) => (
        <mesh 
          key={i} 
          position={ast.position} 
          rotation={ast.rotation} 
          scale={ast.scale}
        >
          {ast.type === 0 && <icosahedronGeometry args={[1, 0]} />}
          {ast.type === 1 && <octahedronGeometry args={[1, 0]} />}
          {ast.type === 2 && <torusGeometry args={[0.8, 0.2, 8, 16]} />}
          
          <meshBasicMaterial 
            color="#00E5FF" 
            wireframe 
            transparent 
            opacity={0.15} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
