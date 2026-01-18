import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Vector2, TextureLoader } from "three";
import { AsciiEffect } from "./AsciiEffect";

// Interactive 3D Logo component
function InteractiveLogo({ mousePos, resolution }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // Load the CodeSapiens logo
  const texture = useTexture("https://res.cloudinary.com/dqudvximt/image/upload/v1756797708/WhatsApp_Image_2025-09-02_at_12.45.18_b15791ea_rnlwrz.jpg");

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on time
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
    
    if (groupRef.current && resolution.x > 0) {
      // Mouse interactivity - move based on mouse position
      const mouseX = (mousePos.x / resolution.x - 0.5) * 2;
      const mouseY = (mousePos.y / resolution.y - 0.5) * 2;
      
      groupRef.current.rotation.y = mouseX * 0.5;
      groupRef.current.rotation.x = -mouseY * 0.3;
      groupRef.current.position.x = mouseX * 0.5;
      groupRef.current.position.y = mouseY * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main logo sphere with texture */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Orbiting particles */}
      <mesh position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[-2.5, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function EffectScene() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState(new Vector2(0, 0));
  const [resolution, setResolution] = useState(new Vector2(1920, 1080));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        setMousePos(new Vector2(x, y));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);

      const rect = container.getBoundingClientRect();
      setResolution(new Vector2(rect.width, rect.height));

      const handleResize = () => {
        const rect = container.getBoundingClientRect();
        setResolution(new Vector2(rect.width, rect.height));
      };
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        
        {/* Interactive Logo with mouse tracking */}
        <InteractiveLogo mousePos={mousePos} resolution={resolution} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 10, -10]} intensity={0.5} color="#4080ff" />

        {/* ASCII Effect with PostFX */}
        <EffectComposer>
          <AsciiEffect
            style="standard"
            cellSize={8}
            invert={false}
            color={false}
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              scanlineIntensity: 0,
              scanlineCount: 200,
              targetFPS: 0,
              jitterIntensity: 0,
              jitterSpeed: 1,
              mouseGlowEnabled: false,
              mouseGlowRadius: 200,
              mouseGlowIntensity: 1.5,
              vignetteIntensity: 0,
              vignetteRadius: 0.8,
              colorPalette: 0,
              curvature: 0,
              aberrationStrength: 0,
              noiseIntensity: 0,
              noiseScale: 1,
              noiseSpeed: 1,
              waveAmplitude: 0,
              waveFrequency: 10,
              waveSpeed: 1,
              glitchIntensity: 0,
              glitchFrequency: 0,
              brightnessAdjust: 0,
              contrastAdjust: 1,
            }}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
