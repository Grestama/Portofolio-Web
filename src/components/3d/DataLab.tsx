"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";

export function DataLab() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1000;
  
  // States: 0 = Raw Data (Random), 1 = Clustered (Analysis)
  const [stage, setStage] = useState(0);

  // Generate target positions for the two stages
  const { rawPositions, clusteredPositions, colors } = useMemo(() => {
    const raw = new Float32Array(count * 3);
    const clustered = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const colorObj = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Raw: Random within a cube
      raw[i * 3] = (Math.random() - 0.5) * 10;
      raw[i * 3 + 1] = (Math.random() - 0.5) * 10;
      raw[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Clustered: 3 distinct spherical clusters
      const clusterId = i % 3;
      const radius = Math.random() * 1.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      let cx = 0, cy = 0, cz = 0;
      if (clusterId === 0) { cx = -3; cy = 2; cz = 0; colorObj.set("#00E5FF"); }
      if (clusterId === 1) { cx = 3; cy = -2; cz = 1; colorObj.set("#00A3FF"); }
      if (clusterId === 2) { cx = 0; cy = 0; cz = -3; colorObj.set("#FFFFFF"); }

      clustered[i * 3] = cx + radius * Math.sin(phi) * Math.cos(theta);
      clustered[i * 3 + 1] = cy + radius * Math.sin(phi) * Math.sin(theta);
      clustered[i * 3 + 2] = cz + radius * Math.cos(phi);

      cols[i * 3] = colorObj.r; cols[i * 3 + 1] = colorObj.g; cols[i * 3 + 2] = colorObj.b;
    }
    return { rawPositions: raw, clusteredPositions: clustered, colors: cols };
  }, [count]);

  const currentPositions = useRef(new Float32Array(rawPositions));
  const dummy = new THREE.Object3D();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Auto-cycle stages every 5 seconds for the demo
    const time = state.clock.elapsedTime;
    const currentStage = Math.floor(time / 5) % 2;
    
    const targetPositions = currentStage === 0 ? rawPositions : clusteredPositions;
    
    // Interpolate positions
    for (let i = 0; i < count; i++) {
      currentPositions.current[i * 3] = THREE.MathUtils.lerp(currentPositions.current[i * 3], targetPositions[i * 3], 0.05);
      currentPositions.current[i * 3 + 1] = THREE.MathUtils.lerp(currentPositions.current[i * 3 + 1], targetPositions[i * 3 + 1], 0.05);
      currentPositions.current[i * 3 + 2] = THREE.MathUtils.lerp(currentPositions.current[i * 3 + 2], targetPositions[i * 3 + 2], 0.05);
      
      dummy.position.set(
        currentPositions.current[i * 3],
        currentPositions.current[i * 3 + 1],
        currentPositions.current[i * 3 + 2]
      );
      
      // Add slight floating motion
      dummy.position.y += Math.sin(time * 2 + i) * 0.1;
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, new THREE.Color(colors[i*3], colors[i*3+1], colors[i*3+2]));
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    // Slowly rotate the whole lab
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <group scale={0.5}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshBasicMaterial />
      </instancedMesh>
      
      {/* Floating labels for storytelling */}
      <Billboard position={[-3, 4, 0]}>
        <Text fontSize={0.5} color="#00E5FF" outlineWidth={0.02} outlineColor="#000">K-Means Clustering</Text>
      </Billboard>
    </group>
  );
}
