import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function GlowEffect({ intensity, color }) {
  const glow = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    glow.current.material.emissiveIntensity =
      intensity + Math.sin(time * 2) * 0.5;
  });

  return (
    <mesh ref={glow}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
      />
    </mesh>
  );
}

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(0x404040),
            emissiveIntensity: 0.2,
          });
        }
      });
    }
  }, [scene]);

  return <primitive ref={modelRef} object={scene} />;
}

const SpeakerObject = () => {
  return (
    <>
      <Model url="/models/map_object/Speaker.glb" />
      <GlowEffect intensity={1.5} color={"#00ff00"} />
    </>
  );
};

export default SpeakerObject;
