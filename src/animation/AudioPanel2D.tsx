import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useState, useEffect } from "react";
import { PlainAnimator } from "three-plain-animator";
import rhythmSprite from "/images/Rhythm.png";

const AudioPanel2D = () => {
  // Load textures
  const graphRunningSpriteTexture = useLoader(THREE.TextureLoader, rhythmSprite);

  const graphRunning = new PlainAnimator(graphRunningSpriteTexture, 12, 1, 12, 8);

  // Animate based on the current state
  useFrame(() => {
    graphRunning.animate();
  });

  return (
    <mesh
      key="graph_running_audio"
      position={[0, 4, 0]}
      scale={[1, 1, 1]}
    >
      {/* Use PlaneGeometry for a flat surface */}
      <planeGeometry args={[4, 5]} />
      <meshStandardMaterial
        map={graphRunning.texture}
        color={"white"}
        opacity={1}
        transparent={true}
      />
    </mesh>
  );
};

export default AudioPanel2D;