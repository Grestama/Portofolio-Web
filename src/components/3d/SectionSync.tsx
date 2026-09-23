"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

interface SectionSyncProps {
  targetId: string;
  children: React.ReactNode;
  objectZ?: number;
  syncX?: boolean;
  syncScale?: boolean;
}

export function SectionSync({ targetId, children, objectZ = 0, syncX = false, syncScale = false }: SectionSyncProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const skillFocus = useStore((state) => state.skillFocus);

  useFrame(() => {
    if (!groupRef.current) return;
    const el = document.getElementById(targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    
    // Calculate how many 3D units represent one pixel at this object's distance
    const distance = camera.position.z - objectZ;
    // Don't calculate if distance is negative or zero (behind camera) or if size is 0
    if (distance <= 0 || size.height === 0) return;
    
    const vFov = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const unitsPerPixel = height / size.height;

    // Y Axis
    const elementCenterY = rect.top + rect.height / 2;
    const screenCenterY = size.height / 2;
    const pixelOffsetY = screenCenterY - elementCenterY;
    let targetY = camera.position.y + pixelOffsetY * unitsPerPixel;
    if (isNaN(targetY)) targetY = 0;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

    // X Axis (optional sync)
    let targetX = groupRef.current.position.x;
    if (syncX) {
      const elementCenterX = rect.left + rect.width / 2;
      const screenCenterX = size.width / 2;
      const pixelOffsetX = elementCenterX - screenCenterX;
      targetX = camera.position.x + pixelOffsetX * unitsPerPixel;
      if (isNaN(targetX)) targetX = 0;
    }
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

    // Visibility / Scale when zooming into a Skill
    // If a skill is focused and this section is NOT the skills graph, hide it!
    const isObscured = skillFocus.active && targetId !== 'skills-sticky';

    // Scale
    let targetScaleX = 1;
    let targetScaleY = 1;
    let targetScaleZ = 1;

    if (syncScale) {
      targetScaleX = rect.width * unitsPerPixel;
      targetScaleY = rect.height * unitsPerPixel;
    }

    if (isObscured) {
      // Shrink to zero to get out of the way smoothly
      targetScaleX = 0.001;
      targetScaleY = 0.001;
      targetScaleZ = 0.001;
    }

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScaleX, 0.1);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScaleY, 0.1);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScaleZ, 0.1);
    
    groupRef.current.position.z = objectZ;
  });

  return <group ref={groupRef}>{children}</group>;
}
