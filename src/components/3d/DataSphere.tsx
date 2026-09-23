"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useStore } from "@/store/useStore";
const HologramMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#00E5FF") },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Slight pulsating
      vec3 pos = position;
      pos += normal * sin(uTime * 2.0) * 0.05;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    
    void main() {
      // Fresnel effect for holographic rim lighting
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 3.0);
      
      // Scanlines
      float scanline = sin(vPosition.y * 50.0 - uTime * 10.0) * 0.5 + 0.5;
      
      vec3 finalColor = uColor * fresnel + uColor * scanline * 0.5;
      
      gl_FragColor = vec4(finalColor, fresnel * 0.8 + 0.2);
    }
  `
);
extend({ HologramMaterial });

export function DataSphere() {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const isMobile = useStore((state) => state.isMobile);
  const toggles = useStore((state) => state.toggles);
  const [mouse, setMouse] = useState(new THREE.Vector2());

  // Handle mouse movement for 3D repulsion/tilt
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouse(new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      ));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Generate particles
  const count = isMobile ? 1000 : 3000;
  const [positions, colors, originalPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Create a network sphere with a thicker outer shell
      const r = 2 + Math.pow(Math.random(), 2) * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      orig[i * 3] = x; orig[i * 3 + 1] = y; orig[i * 3 + 2] = z;
      vel[i * 3] = 0; vel[i * 3 + 1] = 0; vel[i * 3 + 2] = 0;

      // Color mapping: electric blue/cyan/white
      const mix = Math.random();
      if (mix > 0.8) color.set("#FFFFFF");
      else if (mix > 0.4) color.set("#00E5FF");
      else color.set("#00A3FF");

      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    return [pos, col, orig, vel];
  }, [count]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !coreRef.current) return;
    
    // Hide entirely if particles are toggled off
    pointsRef.current.visible = toggles.particles;
    coreRef.current.visible = toggles.particles;
    
    // Update shader time
    if (coreRef.current && (coreRef.current.material as any).uTime !== undefined) {
      (coreRef.current.material as any).uTime = state.clock.elapsedTime;
    }

    if (!toggles.particles) return;

    // 1. Idle Rotation
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
    coreRef.current.rotation.y -= delta * 0.03;

    // 2. Mouse Interaction (Tilt & Repulsion)
    if (!isMobile) {
      // Tilt the entire sphere based on mouse
      const targetRotationX = mouse.y * 0.5;
      const targetRotationY = mouse.x * 0.5;
      
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotationX, 0.05);
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotationY, 0.05);
      
      // Raycast to find mouse position in 3D for particle repulsion
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / dir.z;
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Modify particle positions using velocity and spring physics
      const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const dummyV3 = new THREE.Vector3();
      const origV3 = new THREE.Vector3();
      
      const spring = 0.05; // Spring force back to original
      const friction = 0.85; // Velocity dampening
      
      for (let i = 0; i < count; i++) {
        origV3.set(originalPositions[i * 3], originalPositions[i * 3 + 1], originalPositions[i * 3 + 2]);
        
        // Convert original to world coordinates to check distance to mouse
        dummyV3.copy(origV3).applyMatrix4(pointsRef.current.matrixWorld);
        
        const dist = dummyV3.distanceTo(pos);
        if (dist < 2.5) { // Repulsion radius increased
          const force = (2.5 - dist) * 0.05; // Push strength
          const push = dummyV3.sub(pos).normalize().multiplyScalar(force);
          
          velocities[i * 3] += push.x;
          velocities[i * 3 + 1] += push.y;
          velocities[i * 3 + 2] += push.z;
        }
        
        // Apply spring force back to original position
        velocities[i * 3] += (originalPositions[i * 3] - positionsArray[i * 3]) * spring;
        velocities[i * 3 + 1] += (originalPositions[i * 3 + 1] - positionsArray[i * 3 + 1]) * spring;
        velocities[i * 3 + 2] += (originalPositions[i * 3 + 2] - positionsArray[i * 3 + 2]) * spring;
        
        // Apply friction
        velocities[i * 3] *= friction;
        velocities[i * 3 + 1] *= friction;
        velocities[i * 3 + 2] *= friction;
        
        // Update positions
        positionsArray[i * 3] += velocities[i * 3];
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1];
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={isMobile ? 0.04 : 0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Inner core glow - abstract network core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        {/* @ts-ignore */}
        <hologramMaterial transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
