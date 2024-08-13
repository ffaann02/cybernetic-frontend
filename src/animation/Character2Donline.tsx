import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useContext, useState } from "react";
import { PlainAnimator } from "three-plain-animator";
import idleSpriteBlue from "/images/online-character/idle-blue.png";
import idleSpriteOrange from "/images/online-character/idle-orange.png";
import runningSprite from "/images/RunningSpriteNew.png";
import pickUpRunningSprite from "/images/PickRunningSpriteNew.png";
import pickUpIdleSprite from "/images/PickIdleSpriteNew.png";
import jumpSprite from "/images/jump.png";
import deathSprite from "/images/Death.png";
import { AnimationState } from "../hooks/useCharacterAnimation";
import { GameContext } from "../contexts/GameContext";
import FakeGlowMaterial from "../components/FakeGlowMaterial";

const Character2Donline = ({
  direction,
  animation,
  variant = "blue",
}: {
  direction: "left" | "right";
  animation: AnimationState;
  variant: "blue" | "orange";
}) => {
  const { isHidden, isDeath } = useContext(GameContext);

  // Load textures based on the variant
  const idleSpriteTexture = useLoader(
    THREE.TextureLoader,
    variant === "blue" ? idleSpriteBlue : idleSpriteOrange
  );
  const runningSpriteTexture = useLoader(THREE.TextureLoader, runningSprite);
  const jumpSpriteTexture = useLoader(THREE.TextureLoader, jumpSprite);
  const pickUpRunningSpriteTexture = useLoader(
    THREE.TextureLoader,
    pickUpRunningSprite
  );
  const pickUpIdleSpriteTexture = useLoader(
    THREE.TextureLoader,
    pickUpIdleSprite
  );
  const deathSpriteTexture = useLoader(THREE.TextureLoader, deathSprite);

  // Adjust texture settings for pixel art
  [
    idleSpriteTexture,
    runningSpriteTexture,
    jumpSpriteTexture,
    pickUpRunningSpriteTexture,
    pickUpIdleSpriteTexture,
    deathSpriteTexture,
  ].forEach((texture) => {
    texture.minFilter = THREE.NearestFilter;
  });

  // Initialize animators
  const [animators] = useState<{ [key in AnimationState]: PlainAnimator }>({
    idle: new PlainAnimator(idleSpriteTexture, 4, 1, 4, 4),
    running: new PlainAnimator(runningSpriteTexture, 9, 1, 9, 9),
    jumping: new PlainAnimator(jumpSpriteTexture, 3, 1, 3, 4),
    picking: new PlainAnimator(pickUpRunningSpriteTexture, 9, 1, 9, 9),
    picking_idle: new PlainAnimator(pickUpIdleSpriteTexture, 4, 1, 4, 4),
    death: new PlainAnimator(deathSpriteTexture, 10, 1, 10, 3),
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
        opacity={isDeath ? 0 : isHidden ? 0.5 : 1}
        transparent={true}
      />
    </mesh>
  );
};

export default Character2Donline;