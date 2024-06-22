import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useState } from "react";
import { PlainAnimator } from "three-plain-animator";
import imageSrc from "/images/homer.png";

const Character2D = ({ direction }: { direction: "left" | "right" }) => {
  const spriteTexture = useLoader(THREE.TextureLoader, imageSrc);
  const [animator] = useState(
    () => new PlainAnimator(spriteTexture, 4, 4, 10, 10)
  );

  useFrame(() => animator.animate());

  return (
    <mesh
      key="main_character"
      position={[1, 3.8, 4]}
      scale={[direction === "left" ? -1 : 1, 1, 0.001]}
    >
      <boxGeometry args={[4, 4, 0.001]} />
      <meshStandardMaterial map={spriteTexture} transparent={true} />
    </mesh>
  );
};

export default Character2D;
