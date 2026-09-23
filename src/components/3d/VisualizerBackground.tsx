"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { audioManager } from "@/lib/audioManager";
import { useStore } from "@/store/useStore";

const vertexShader = `
uniform float uTime;
uniform float uData[64];
uniform float uActive;

varying vec2 vUv;
varying float vHeight;

// Simplex/Hash noise functions for organic terrain
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Calculate distance from center
  float dist = distance(vUv, vec2(0.5));
  float normalizedDist = dist * 2.0; // 0 at center, 1 at edge
  
  // Averages for global modulation
  float bass = 0.0;
  float mid = 0.0;
  float treble = 0.0;
  
  for(int i=0; i<8; i++) bass += uData[i] / 255.0;
  for(int i=8; i<30; i++) mid += uData[i] / 255.0;
  for(int i=30; i<64; i++) treble += uData[i] / 255.0;
  
  bass /= 8.0;
  mid /= 22.0;
  treble /= 34.0;

  // 1. PUSAT GUNUNGAN BEAT (Central Bass Mountain)
  // Sharp drop-off so it forms a distinct central peak
  float centerDome = pow(clamp(1.0 - normalizedDist * 1.5, 0.0, 1.0), 2.5);
  float centerMountain = centerDome * (bass * 45.0 + 2.0);
  
  // 2. TETESAN AIR (Concentric Water Ripples)
  // Sine wave radiating outward from the center
  float rippleSpeed = uTime * 5.0;
  float rippleFreq = 60.0; // Number of rings
  float baseRipple = sin(dist * rippleFreq - rippleSpeed);
  
  // The ripples are stronger near the center and fade out towards the edges
  float rippleEnvelope = clamp(1.0 - normalizedDist, 0.0, 1.0);
  
  // Make ripples react powerfully to Mids and Trebles
  float activeRipples = baseRipple * (mid * 15.0 + treble * 8.0 + 1.0) * rippleEnvelope;
  
  // 3. GRAFIK KEREN (Cool Graphic Noise / Details)
  // Add some angular distortion so the rings aren't completely perfect, giving a digital/audio look
  float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  float angularNoise = sin(angle * 16.0 + uTime * 2.0) * (mid * 4.0);
  
  // Add some simplex noise for texture on the water surface
  float surfaceNoise = noise(vUv * 25.0 - uTime * 0.5) * (bass * 4.0 + 1.0);
  
  // Combine all layers
  float activeHeight = centerMountain + activeRipples + angularNoise + surfaceNoise;
  
  // Calm state when music is off (gentle water ripples)
  float calmWave = sin(dist * 40.0 - uTime * 2.0) * 1.5 * rippleEnvelope;
  
  // Fade out edges completely
  float edgeX = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
  float edgeY = smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
  float falloff = edgeX * edgeY;
  
  float rawHeight = mix(calmWave, activeHeight, uActive) * falloff;
  
  // Soft cap the maximum height
  float maxHeight = 28.0; 
  float finalHeight = maxHeight * (1.0 - exp(-rawHeight / maxHeight));
  
  pos.z += finalHeight;
  vHeight = finalHeight; 

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vHeight;

void main() {
  // Normalize height based on our new max soft cap (around 25-28)
  float h = clamp(vHeight / 25.0, 0.0, 1.0);
  
  // Stunning Cyberpunk / Synthwave color palette
  vec3 colorDeep = vec3(0.05, 0.0, 0.3);     // Deep void purple
  vec3 colorMid  = vec3(0.0, 0.8, 1.0);      // Brilliant Cyan
  vec3 colorPeak = vec3(1.0, 0.0, 0.8);      // Hot Pink
  vec3 colorTip  = vec3(1.0, 1.0, 0.0);      // Neon Yellow
  
  vec3 finalColor = vec3(0.0);
  
  if (h < 0.3) {
    // 0.0 to 0.3: Deep Purple to Cyan
    float t = h / 0.3;
    finalColor = mix(colorDeep, colorMid, t);
  } else if (h < 0.7) {
    // 0.3 to 0.7: Cyan to Hot Pink
    float t = (h - 0.3) / 0.4;
    finalColor = mix(colorMid, colorPeak, t);
  } else {
    // 0.7 to 1.0: Hot Pink to Neon Yellow
    float t = (h - 0.7) / 0.3;
    finalColor = mix(colorPeak, colorTip, t);
  }
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function VisualizerBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const audioEnabled = useStore((state) => state.audioEnabled);
  const toggles = useStore((state) => state.toggles);
  
  // We use an array of 64 floats for the uniform
  const dataUniformRef = useRef(new Float32Array(64));
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      let active = 0.0;
      
      if (audioEnabled) {
        const data = audioManager.getFrequencyData();
        if (data) {
          // LERP for EXTRA BUTTERY SMOOTH liquid movement (lowered from 0.15 to 0.06)
          for(let i=0; i<64; i++) {
            dataUniformRef.current[i] = THREE.MathUtils.lerp(dataUniformRef.current[i], data[i], 0.06);
          }
          active = 1.0;
        }
      } else {
        // Smoothly return to 0 when off
        for(let i=0; i<64; i++) {
          dataUniformRef.current[i] = THREE.MathUtils.lerp(dataUniformRef.current[i], 0, 0.03);
        }
      }
      
      // Smoothly transition the active state
      materialRef.current.uniforms.uActive.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uActive.value,
        active,
        0.05
      );

      
      materialRef.current.uniforms.uData.value = dataUniformRef.current;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uData: { value: dataUniformRef.current },
      uActive: { value: 0 },
    }),
    []
  );

  if (!toggles.shaders) return null;

  return (
    // Pushed 2x further back (-50) and scaled proportionally so it stays huge but extremely far from the cards
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, -50]}>
      {/* Increased size to 400x400 to compensate for the perspective distance */}
      <planeGeometry args={[400, 400, 200, 200]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        blending={THREE.AdditiveBlending} // This makes the wireframe lines glow intensely when they overlap
        depthWrite={false} // Helps blending look much cleaner
      />
    </mesh>
  );
}
