import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useState } from "react";
import { PlainAnimator } from "three-plain-animator";
import idleSprite from "../assets/assistant-bot/IdleAnim.png";
import happySprite from "../assets/assistant-bot/HappyAnim.png";
import angrySprite from "../assets/assistant-bot/AngryAnim.png";
import chargeSprite from "../assets/assistant-bot/Charge.png";

const Assistant2D = ({
//   direction,
  animation,
}: {
  //   direction: "left" | "right";
  //   animation: AnimationState;
}) => {
  // Load textures
  const idleSpriteTexture = useLoader(THREE.TextureLoader, idleSprite);
  const happySpriteTexture = useLoader(THREE.TextureLoader, happySprite);
  const angrySpriteTexture = useLoader(THREE.TextureLoader, angrySprite);
  const chargeSpriteTexture = useLoader(THREE.TextureLoader, chargeSprite);

  // Adjust texture settings for pixel art
  [
    idleSpriteTexture,
    happySpriteTexture,
    angrySpriteTexture,
    chargeSpriteTexture,
  ].forEach((texture) => {
    texture.minFilter = THREE.NearestFilter;
  });

  // Initialize animators
  const [animators] = useState({
    idle: new PlainAnimator(idleSpriteTexture, 9, 1, 8, 4),
    happy: new PlainAnimator(happySpriteTexture, 9, 1, 8, 6),
    angry: new PlainAnimator(angrySpriteTexture, 4, 3, 10, 6),
    charge: new PlainAnimator(chargeSpriteTexture, 4, 3, 10, 6),
  });

  //   Animate based on the current state
  useFrame(() => {
    animators[animation].animate();
  });

  return (
    <mesh key="assistant_bot" position={[1, 3.5, 3.8]} scale={[-1.5, 1.5, 1]}>
      {/* Use PlaneGeometry for a flat surface */}
      <planeGeometry args={[4, 5]} />
      <meshStandardMaterial
        map={animators[animation].texture}
        transparent={true}
      />
    </mesh>
  );
};

export default Assistant2D;
