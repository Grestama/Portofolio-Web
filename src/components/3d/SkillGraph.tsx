"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line, Html, Billboard, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, a } from "@react-spring/three";
import { useStore } from "@/store/useStore";
import { skillsConfig, skillLinksConfig, SkillNode } from "@/config/skills";

// Helper to determine node visual based on category/style
function NodeGeometry({ node }: { node: SkillNode }) {
  if (node.visualStyle === "glass") {
    return (
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          emissive="#00E5FF"
          emissiveIntensity={0.8}
          wireframe={true}
          transparent
          opacity={0.9}
        />
      </mesh>
    );
  } else if (node.visualStyle === "cyan-glow") {
    return (
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
      </mesh>
    );
  } else if (node.visualStyle === "wireframe") {
    return (
      <mesh>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.5} />
      </mesh>
    );
  } else if (node.visualStyle === "neural") {
    return (
      <mesh>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.5} />
      </mesh>
    );
  } else if (node.visualStyle === "cluster") {
    return (
      <group>
        <mesh position={[0.1, 0.1, 0]}><sphereGeometry args={[0.15, 8, 8]}/><meshBasicMaterial color="#F59E0B"/></mesh>
        <mesh position={[-0.1, -0.1, 0.1]}><sphereGeometry args={[0.1, 8, 8]}/><meshBasicMaterial color="#F59E0B"/></mesh>
        <mesh position={[0, 0.15, -0.1]}><sphereGeometry args={[0.12, 8, 8]}/><meshBasicMaterial color="#F59E0B"/></mesh>
      </group>
    );
  } else {
    // Solid default
    return (
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.4} />
      </mesh>
    );
  }
}

function SkillNodeMesh({ 
  node, 
  isHovered, 
  isFocused, 
  isDimmed,
  isGraphFocused,
  onHover, 
  onClick 
}: { 
  node: SkillNode, 
  isHovered: boolean, 
  isFocused: boolean, 
  isDimmed: boolean,
  isGraphFocused: boolean,
  onHover: (id: string | null) => void,
  onClick: (id: string, worldPos: [number, number, number]) => void
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Spring animations for interaction
  const { scale } = useSpring({
    scale: isHovered ? 1.2 : (isFocused ? 1.1 : 1),
    config: { mass: 1, tension: 200, friction: 20 }
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.1 : (isFocused || isHovered ? 1 : 0.8),
  });

    // Organic floating motion
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Stop all organic motion if the graph is focused
    if (!isGraphFocused) {
      // Rotate slowly
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.1;
      
      // Bobbing based on node ID to make them async
      const offset = node.id.length; 
      groupRef.current.position.y = (node.pos[1] * 1.1) + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.1;
    }
  });

  return (
    <a.group 
      ref={groupRef}
      position={[node.pos[0] * 1.1, node.pos[1] * 1.1, node.pos[2] * 1.1]} 
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        
        // Compute precise world position when clicked so camera can zoom accurately
        const worldPos = new THREE.Vector3();
        if (groupRef.current) {
          groupRef.current.getWorldPosition(worldPos);
        }
        
        onClick(node.id, [worldPos.x, worldPos.y, worldPos.z]);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <group visible={!isDimmed}>
        {/* Invisible hit-box for all nodes to ensure they are easily clickable */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <NodeGeometry node={node} />
        
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, -0.9, 0]}
            fontSize={0.22}
            fontWeight="bold"
            color={isHovered || isFocused ? "#00E5FF" : "#ffffff"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
            maxWidth={1.4}
            textAlign="center"
            lineHeight={1.1}
          >
            {node.label}
          </Text>
        </Billboard>
        
      </group>
    </a.group>
  );
}

export function SkillGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = useStore((state) => state.isMobile);
  const skillFocus = useStore((state) => state.skillFocus);
  const setSkillFocus = useStore((state) => state.setSkillFocus);
  const exploreMode = useStore((state) => state.exploreMode);
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Scroll listener to naturally exit focus mode when scrolling away
  useEffect(() => {
    if (!skillFocus.active) return;
    
    let startScroll = window.scrollY;
    
    const handleScroll = () => {
      if (Math.abs(window.scrollY - startScroll) > 150) {
        setSkillFocus({ active: false, skillId: null });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skillFocus.active, setSkillFocus]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Continuous slow ambient rotation of the entire graph unless we are focused
    if (!skillFocus.active) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  if (isMobile) return null;

  // Determine which nodes are related to the focused/hovered node
  const activeNodeId = hoveredNode || skillFocus.skillId;
  
  const relatedNodeIds = useMemo(() => {
    if (!activeNodeId) return [];
    
    const related = new Set<string>();
    related.add(activeNodeId);
    
    skillLinksConfig.forEach(([src, tgt]) => {
      if (src === activeNodeId) related.add(tgt);
      if (tgt === activeNodeId) related.add(src);
    });
    
    return Array.from(related);
  }, [activeNodeId]);

  return (
    <PresentationControls
      global={true} 
      cursor={true} 
      snap={false}
      speed={1.5}
      zoom={1}
      rotation={[0, 0, 0]}
      enabled={!skillFocus.active}
    >
      <group 
        ref={groupRef} 
        position={[0, 0, 0]}
        scale={0.8}
        // Click on background clears focus
        onPointerMissed={() => {
          if (skillFocus.active) {
            setSkillFocus({ active: false, skillId: null });
          }
        }}
      >
        {/* Connections */}
        {skillLinksConfig.map(([sourceId, targetId], i) => {
          const source = skillsConfig.find(n => n.id === sourceId)!;
          const target = skillsConfig.find(n => n.id === targetId)!;
          
          const isRelated = activeNodeId ? (sourceId === activeNodeId || targetId === activeNodeId) : false;
          const isDimmed = activeNodeId ? !isRelated : false;
          
          const color = isRelated ? "#00E5FF" : "#ffffff";
          const opacity = isRelated ? 0.6 : (isDimmed ? 0.05 : 0.2);

          return (
            <Line
              key={i}
              points={[
                new THREE.Vector3(source.pos[0] * 1.1, source.pos[1] * 1.1, source.pos[2] * 1.1), 
                new THREE.Vector3(target.pos[0] * 1.1, target.pos[1] * 1.1, target.pos[2] * 1.1)
              ]}
              color={color}
              opacity={opacity}
              transparent
              lineWidth={isRelated ? 2 : 1}
            />
          );
        })}

        {/* Nodes */}
        {skillsConfig.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isFocused = skillFocus.skillId === node.id;
          const isRelated = relatedNodeIds.includes(node.id);
          const isDimmed = activeNodeId ? !isRelated : false;

          return (
            <SkillNodeMesh 
              key={node.id}
              node={node}
              isHovered={isHovered}
              isFocused={isFocused}
              isDimmed={isDimmed}
              isGraphFocused={skillFocus.active}
              onHover={setHoveredNode}
              onClick={(id, worldPos) => setSkillFocus({ active: true, skillId: id, worldPos })}
            />
          );
        })}
      </group>
    </PresentationControls>
  );
}
