"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

export function CosmicDust() {
  const perfTier = useStore((state) => state.perfTier);
  const isHigh = perfTier === 'HIGH';
  
  // Ref for shooting stars
  const cometsRef = useRef<THREE.InstancedMesh>(null);
  
  // Comet data
  const cometCount = isHigh ? 5 : 2;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const comets = useMemo(() => {
    const data = [];
    for (let i = 0; i < cometCount; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          -10 - Math.random() * 30
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          10 + Math.random() * 20 // Move fast towards camera
        ),
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 10 // Delay before appearing
      });
    }
    return data;
  }, [cometCount]);

  useFrame((state, delta) => {
    if (!cometsRef.current) return;
    
    comets.forEach((comet, i) => {
      if (comet.delay > 0) {
        comet.delay -= delta;
        dummy.position.set(999, 999, 999); // Hide offscreen
      } else {
        comet.position.addScaledVector(comet.velocity, delta);
        
        // Reset comet if it passes camera
        if (comet.position.z > 10) {
          comet.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            -40 - Math.random() * 20
          );
          comet.delay = Math.random() * 5 + 2; // Random delay between 2-7s
        }
        
        dummy.position.copy(comet.position);
        
        // Orient the cylinder along the velocity vector
        dummy.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          comet.velocity.clone().normalize()
        );
        
        // Stretch length based on speed
        dummy.scale.set(0.05 * comet.scale, 2 * comet.scale, 0.05 * comet.scale);
      }
      
      dummy.updateMatrix();
      cometsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    cometsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Background ambient stars */}
      <Stars 
        radius={50} 
        depth={50} 
        count={isHigh ? 4000 : 1500} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
      
      {/* Fast moving comets/shooting stars */}
      <instancedMesh ref={cometsRef} args={[undefined, undefined, cometCount]}>
        <cylinderGeometry args={[1, 1, 1, 4]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
      </instancedMesh>
    </group>
  );
}
