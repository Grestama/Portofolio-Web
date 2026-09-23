"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { assets } from "@/config/assets";
import { useStore } from "@/store/useStore";

import { SectionSync } from "./SectionSync";

import { projectsConfig } from "@/config/projects";

// Custom Shader for Project Images
const ProjectMaterial = shaderMaterial(
  { uTexture: new THREE.Texture(), uHover: 0 },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uHover;
    void main() {
      vUv = uv;
      vec3 pos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uHover;
    void main() {
      // Base texture
      vec4 texColor = texture2D(uTexture, vUv);
      vec3 color = texColor.rgb;
      
      // Darken slightly if not hovered to make the hover pop out more
      color = mix(color * 0.6, color, uHover);
      
      // Thick Cyan Border
      // Since it's a 16:9 or similar rect, 0.01 on X is different from 0.01 on Y.
      // But a simple UV edge check gives a nice stylish tech border.
      float borderX = 0.015;
      float borderY = 0.025;
      
      bool isBorder = vUv.x < borderX || vUv.x > 1.0 - borderX || 
                      vUv.y < borderY || vUv.y > 1.0 - borderY;
                      
      if (isBorder) {
        vec3 borderColor = vec3(0.0, 0.9, 1.0); // #00E5FF (Cyan)
        // Border glows intensely when hovered
        color = mix(borderColor * 0.4, borderColor * 1.5, uHover);
      }
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);
extend({ ProjectMaterial });

export function ProjectGallery() {
  const isMobile = useStore((state) => state.isMobile);
  const setCursorState = useStore((state) => state.setCursorState);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Load textures
  const textures = useTexture(projectsConfig.map(p => p.image));

  if (isMobile) return null; // Fallback to DOM on mobile

  return (
    <group>
      {projectsConfig.map((project, i) => {
        return (
          <SectionSync key={project.id} targetId={`project-image-${project.id}`} objectZ={-6} syncX={true} syncScale={true}>
            <ProjectPlane 
              texture={textures[i]}
              isHovered={hoveredId === project.id}
              onHover={() => { setHoveredId(project.id); setCursorState('image'); }}
              onUnhover={() => { setHoveredId(null); setCursorState('default'); }}
            />
          </SectionSync>
        );
      })}
    </group>
  );
}

function ProjectPlane({ texture, isHovered, onHover, onUnhover }: any) {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [mouse, setMouse] = useState(new THREE.Vector2());

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uHover = THREE.MathUtils.lerp(materialRef.current.uHover, isHovered ? 1 : 0, 0.1);
    }
    if (meshRef.current) {
      // Move forward significantly if hovered to emphasize the 3D pop
      const targetZ = isHovered ? 2.5 : 0;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
      
      // Stronger tilt based on mouse position if hovered (pop in/out effect)
      if (isHovered) {
        // Reverse the mouse.y for natural tilt feeling
        const targetRotX = mouse.y * 0.35; 
        const targetRotY = mouse.x * 0.35;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.1);
      } else {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      }
    }
  });

  const handlePointerMove = (e: any) => {
    // Normalize coordinates relative to the screen
    setMouse(new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    ));
  };

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={onHover}
      onPointerOut={onUnhover}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <projectMaterial ref={materialRef} uTexture={texture} />
    </mesh>
  );
}
