import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useState } from "react";
import { PlainAnimator } from "three-plain-animator";
import idleSprite from "/images/idle.png";
import runningSprite from "/images/homer.png";
import { AnimationState } from "../hooks/useCharacterAnimation";


const Character2D = ({
  direction,
  animation,
}: {
  direction: "left" | "right";
    animation: AnimationState
}) => {
  const idleSpriteTexture = useLoader(THREE.TextureLoader, idleSprite);
  const runningSpriteTexture = useLoader(THREE.TextureLoader, runningSprite);
  const [animators] = useState<{ [key in AnimationState]: PlainAnimator }>({
    idle: new PlainAnimator(idleSpriteTexture, 3, 1, 3, 4),
    running: new PlainAnimator(runningSpriteTexture, 4, 4, 10, 10),
    jumping: new PlainAnimator(runningSpriteTexture, 4, 4, 10, 10),
  });

  useFrame(() => {
    animators[animation].animate();
  });

  return (
    <mesh
      key="main_character"
      position={[1.2, 4, 3.8]}
      scale={[direction === "left" ? -1 : 1, 1, 1]}
    //   castShadow
    >
      <boxGeometry args={[4, 5, 0.001]}
      />
      <meshStandardMaterial
        map={animators[animation].texture}
        transparent={true}
      />
    </mesh>
  );
};

export default Character2D;
