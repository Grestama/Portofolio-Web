"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Environment, PerformanceMonitor, Stars } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { DataSphere } from "./DataSphere";
import { SkillGraph } from "./SkillGraph";
import { SectionSync } from "./SectionSync";

import { CosmicDust } from "./CosmicDust";
import { TechAsteroids } from "./TechAsteroids";
import { Timeline3D } from "./Timeline3D";
import { ContactParticles } from "./ContactParticles";

import { useStore } from "@/store/useStore";
import { sceneSections } from "@/config/scene";
import { skillsConfig } from "@/config/skills";

function SceneExposer() {
  const { scene } = useThree();
  useEffect(() => {
    (window as any).scene = scene;
  }, [scene]);
  return null;
}

function CameraRig() {
  const activeSection = useStore((state) => state.activeSection);
  const skillFocus = useStore((state) => state.skillFocus);
  const exploreMode = useStore((state) => state.exploreMode);
  
  // Track current lookAt target for smooth interpolation
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, -4));

  useFrame((state, delta) => {
    // Default base target based on section
    let targetZ = sceneSections[activeSection]?.targetZ ?? 6;
    let targetX = 0;
    let targetY = 0;
    
    // We adjust lookAt to point slightly ahead of the camera by default
    let idealLookAt = new THREE.Vector3(0, 0, targetZ - 10);
    
    // Override if focused on a skill
    if (activeSection === 'skills' && skillFocus.active && skillFocus.skillId) {
      const node = skillsConfig.find(n => n.id === skillFocus.skillId);
      if (node) {
        if (skillFocus.worldPos) {
          // Use exact world position calculated after rotation
          const [wx, wy, wz] = skillFocus.worldPos;
          targetX = wx * 0.3; // Offset slightly to the left to make room for right panel
          targetY = wy * 0.3; 
          targetZ = wz + 4;   // Back off in Z to not zoom inside the node
          
          idealLookAt.set(wx, wy, wz);
        } else {
          // Fallback if worldPos is missing (shouldn't happen)
          const [nx, ny, nz] = node.pos;
          targetX = nx * 0.5; 
          targetY = ny * 0.3; 
          targetZ = (nz - 10) + 4; 
          idealLookAt.set(nx, ny, nz - 10);
        }
      }
    }
    
    // Smoothly interpolate camera position
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3);
    
    // Smoothly interpolate lookAt
    lookAtTarget.current.lerp(idealLookAt, delta * 4);
    state.camera.lookAt(lookAtTarget.current);
  });
  
  return null;
}

function GlobalLights() {
  const lightRef = useRef<THREE.PointLight>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (lightRef.current) {
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / dir.z;
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
      
      lightRef.current.position.lerp(pos, 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#ffffff" />
      <pointLight ref={lightRef} color="#00E5FF" intensity={2} distance={10} decay={2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00A3FF" />
    </>
  );
}

function DeepSpaceBackground() {
  return (
    <group>
      {/* Tiny distant stars */}
      <Stars radius={100} depth={50} count={5000} factor={2} saturation={0} fade speed={3} />
      {/* Closer larger stars for parallax */}
      <Stars radius={50} depth={20} count={1000} factor={4} saturation={1} fade speed={5} />
    </group>
  );
}

export default function GlobalScene() {
  const setPerfTier = useStore((state) => state.setPerfTier);
  const toggles = useStore((state) => state.toggles);
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        dpr={[1, 2]} 
        gl={{ preserveDrawingBuffer: true }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <SceneExposer />
        <PerformanceMonitor 
          onIncline={() => setPerfTier('HIGH')} 
          onDecline={() => setPerfTier('LOW')} 
        />
        <Suspense fallback={null}>
          <GlobalLights />
          <DeepSpaceBackground />
          <CameraRig />
          <CosmicDust />
          <TechAsteroids />
        </Suspense>
          
        <Suspense fallback={null}>
          <SectionSync targetId="home" objectZ={0}>
            <DataSphere />
          </SectionSync>
        </Suspense>





        <Suspense fallback={null}>
          <SectionSync targetId="skills-sticky" objectZ={-10}>
            <SkillGraph />
          </SectionSync>
        </Suspense>
          
        <Suspense fallback={null}>
          <SectionSync targetId="contact" objectZ={-6} syncX={false}>
            <ContactParticles />
          </SectionSync>
        </Suspense>
      </Canvas>
    </div>
  );
}
