import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, Float } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Complex geometry component with interactive elements
function ComplexGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial 
        color={hovered ? "#ff6b6b" : "#4ecdc4"}
        wireframe={false}
        metalness={0.8}
        roughness={0.2}
        emissive={hovered ? "#ff6b6b" : "#4ecdc4"}
        emissiveIntensity={hovered ? 0.2 : 0.1}
      />
    </mesh>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[-3, 2, 0]}>
        <Box args={[0.5, 0.5, 0.5]}>
          <meshStandardMaterial color="#ff9f43" metalness={0.6} roughness={0.3} />
        </Box>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} position={[3, -1, 0]}>
        <Sphere args={[0.4, 32, 32]}>
          <meshStandardMaterial color="#6c5ce7" metalness={0.7} roughness={0.2} />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5} position={[0, -2, 2]}>
        <Torus args={[0.6, 0.2, 16, 32]}>
          <meshStandardMaterial color="#00cec9" metalness={0.8} roughness={0.1} />
        </Torus>
      </Float>
      
      <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.8} position={[-2, -1, -2]}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#fd79a8" metalness={0.5} roughness={0.4} />
        </mesh>
      </Float>
    </>
  );
}

// DNA-like helix structure
function HelixStructure() {
  const helixRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const helixPoints = [];
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 8;
    const y = (i / 50) * 6 - 3;
    const radius = 1.5;
    helixPoints.push({
      x: Math.cos(angle) * radius,
      y: y,
      z: Math.sin(angle) * radius,
    });
  }

  return (
    <group ref={helixRef} position={[4, 0, -3]}>
      {helixPoints.map((point, index) => (
        <Sphere key={index} args={[0.05]} position={[point.x, point.y, point.z]}>
          <meshStandardMaterial 
            color={`hsl(${(index / helixPoints.length) * 360}, 70%, 60%)`}
            emissive={`hsl(${(index / helixPoints.length) * 360}, 70%, 20%)`}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Simplified particle system
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 200;
  const positions = [];
  
  for (let i = 0; i < particleCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    );
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#74b9ff" />
    </points>
  );
}

// Main 3D Scene component
export default function Scene3D() {
  return (
    <div className="w-full h-[600px] lg:h-[800px] relative three-scene-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
        onCreated={(state) => {
          state.gl.setClearColor('#1a1a1a');
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff6b6b" intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#4ecdc4" intensity={0.5} />
        
        {/* Simple background */}
        <color attach="background" args={['#1a1a1a']} />
        
        {/* 3D Components */}
        <ComplexGeometry />
        <FloatingShapes />
        <HelixStructure />
        <ParticleField />
        
        {/* 3D Text */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1} position={[0, 3, 0]}>
          <Text
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            82 LABS
          </Text>
        </Float>
        
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8} position={[0, 2, 0]}>
          <Text
            fontSize={0.3}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
          >
            3D Development
          </Text>
        </Float>
        
        {/* Interactive controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={15}
          minDistance={3}
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg backdrop-blur-sm">
        <h3 className="font-semibold mb-1">Interactive 3D Scene</h3>
        <p className="text-sm opacity-80">Drag to rotate • Scroll to zoom • Auto-rotating</p>
      </div>
    </div>
  );
}