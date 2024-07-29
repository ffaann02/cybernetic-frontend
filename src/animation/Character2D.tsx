import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useState } from "react";
import { PlainAnimator } from "three-plain-animator";
// import idleSprite from "/images/idle.png";
// import runningSprite from "/images/running.png";
import idleSprite from "/images/IdleSpriteNew.png";
import runningSprite from "/images/RunningSpriteNew.png";
import pickUpRunningSprite from "/images/PickRunningSpriteNew.png";
import pickUpIdleSprite from "/images/PickIdleSpriteNew.png";
import jumpSprite from "/images/jump.png";
import { AnimationState } from "../hooks/useCharacterAnimation";
import { GameContext } from "../contexts/GameContext";

const Character2D = ({
  direction,
  animation,
}: {
  direction: "left" | "right";
  animation: AnimationState;
}) => {
  const { isHidden } = useContext(GameContext);
  // Load textures
  const idleSpriteTexture = useLoader(THREE.TextureLoader, idleSprite);
  const runningSpriteTexture = useLoader(THREE.TextureLoader, runningSprite);
  const jumpSpriteTexture = useLoader(THREE.TextureLoader, jumpSprite);
  const pickUpRunningSpriteTexture = useLoader(THREE.TextureLoader, pickUpRunningSprite);
  const pickUpIdleSpriteTexture = useLoader(THREE.TextureLoader, pickUpIdleSprite);

  // Adjust texture settings for pixel art
  [idleSpriteTexture, runningSpriteTexture, jumpSpriteTexture].forEach(
    (texture) => {
      texture.minFilter = THREE.NearestFilter;
    }
  );

  // Initialize animators
  const [animators] = useState<{ [key in AnimationState]: PlainAnimator }>({
    idle: new PlainAnimator(idleSpriteTexture, 4, 1, 4, 4),
    running: new PlainAnimator(runningSpriteTexture, 9, 1, 9, 9),
    jumping: new PlainAnimator(jumpSpriteTexture, 3, 1, 3, 4),
    picking: new PlainAnimator(pickUpRunningSpriteTexture, 9, 1, 9, 9),
    picking_idle: new PlainAnimator(pickUpIdleSpriteTexture, 4, 1, 4, 4),
  });

  // Animate based on the current state
  useFrame(() => {
    animators[animation].animate();
  });

  return (
    <mesh
      key="main_character"
      position={[0, 4, 0]}
      scale={[direction === "left" ? -1 : 1, 1, 1]}
    >
      {/* Use PlaneGeometry for a flat surface */}
      <planeGeometry args={[4, 5]} />
      <meshStandardMaterial
        map={animators[animation].texture}
        color={isHidden ? new THREE.Color("#0096FF") : new THREE.Color("white")}
        opacity={isHidden ? 0.5 : 1}
        transparent={true}
      />
    </mesh>
  );
};

export default Character2D;
