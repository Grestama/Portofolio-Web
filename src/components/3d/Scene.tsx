"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { DataSphere } from "./DataSphere";

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]} // Optimize for performance but support retina
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Enable mouse interaction only for the 3D space, but keep it subtle */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.2}
          maxAzimuthAngle={0.2}
          minAzimuthAngle={-0.2}
        />
        
        <DataSphere />
        
        {/* Add environment mapping for realistic reflections if we add shiny objects */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
