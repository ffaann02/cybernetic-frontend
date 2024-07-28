import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useState } from "react";
import { PlainAnimator } from "three-plain-animator";
import idleSprite from "/images/idle.png";
import runningSprite from "/images/running.png";
import jumpSprite from "/images/jump.png";

const AudioPanel2D = () => {
  // Load textures
  const idleSpriteTexture = useLoader(THREE.TextureLoader, idleSprite);
  const runningSpriteTexture = useLoader(THREE.TextureLoader, runningSprite);
  const jumpSpriteTexture = useLoader(THREE.TextureLoader, jumpSprite);

  // Adjust texture settings for pixel art
  [idleSpriteTexture, runningSpriteTexture, jumpSpriteTexture].forEach(
    (texture) => {
      texture.minFilter = THREE.NearestFilter;
    }
  );

  const graphRunning = new PlainAnimator(runningSpriteTexture, 6, 1, 6, 8);

  // Animate based on the current state
  useFrame(() => {
    graphRunning.animate();
  });

  return (
    <mesh
      key="graph_running_audio"
      position={[0, 4, 0]}
      scale={[1,1,1]}
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