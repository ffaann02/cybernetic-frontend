import React, { useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { PlainAnimator } from "three-plain-animator";
import { CapsuleCollider } from "@react-three/rapier";
import { enemyConfigs, EnemyConfig } from "../../../animation/EnemyConfig";
import { EnemyAnimationState } from "../../../hooks/useEnemyAnimation";

const Enemy2DHoloGram = ({
  name = "Slime",
  animation = EnemyAnimationState.Idle,
  direction = "left",
  color = "white",
  scale = 1,
  opacityOptional,
}: {
  name: string;
  animation: EnemyAnimationState;
  direction: "left" | "right";
  color?: string;
  scale: number;
  opacityOptional?: number;
}) => {
  const config: EnemyConfig = enemyConfigs[name];

  // Load textures
  const idleSpriteTexture = useLoader(THREE.TextureLoader, config.sprite.idle);
  const runningSpriteTexture = useLoader(
    THREE.TextureLoader,
    config.sprite.running
  );
  const attackSpriteTexture = config.sprite.attack
    ? useLoader(THREE.TextureLoader, config.sprite.attack)
    : null;

  // Adjust texture settings for pixel art
  useEffect(() => {
    [idleSpriteTexture, runningSpriteTexture, attackSpriteTexture].forEach(
      (texture) => {
        if (texture) texture.minFilter = THREE.NearestFilter;
      }
    );
  }, [idleSpriteTexture, runningSpriteTexture, attackSpriteTexture]);

  // Initialize animators
  const [animators, setAnimators] = useState<{
    [key in EnemyAnimationState]: PlainAnimator | null;
  }>({
    idle: new PlainAnimator(
      idleSpriteTexture,
      config.plainAnimator.idle.tilesAmountHorizontally,
      config.plainAnimator.idle.tilesAmountVertically,
      config.plainAnimator.idle.tilesAmount,
      config.plainAnimator.idle.frameRate
    ),
    running: new PlainAnimator(
      runningSpriteTexture,
      config.plainAnimator.running.tilesAmountHorizontally,
      config.plainAnimator.running.tilesAmountVertically,
      config.plainAnimator.running.tilesAmount,
      config.plainAnimator.running.frameRate
    ),
    attack: attackSpriteTexture
      ? new PlainAnimator(
          attackSpriteTexture,
          config.plainAnimator.attack.tilesAmountHorizontally,
          config.plainAnimator.attack.tilesAmountVertically,
          config.plainAnimator.attack.tilesAmount,
          config.plainAnimator.attack.frameRate
        )
      : null,
  });

  // Update animators when name or animation changes
  useEffect(() => {
    setAnimators({
      idle: new PlainAnimator(
        idleSpriteTexture,
        config.plainAnimator.idle.tilesAmountHorizontally,
        config.plainAnimator.idle.tilesAmountVertically,
        config.plainAnimator.idle.tilesAmount,
        config.plainAnimator.idle.frameRate
      ),
      running: new PlainAnimator(
        runningSpriteTexture,
        config.plainAnimator.running.tilesAmountHorizontally,
        config.plainAnimator.running.tilesAmountVertically,
        config.plainAnimator.running.tilesAmount,
        config.plainAnimator.running.frameRate
      ),
      attack: attackSpriteTexture
        ? new PlainAnimator(
            attackSpriteTexture,
            config.plainAnimator.attack.tilesAmountHorizontally,
            config.plainAnimator.attack.tilesAmountVertically,
            config.plainAnimator.attack.tilesAmount,
            config.plainAnimator.attack.frameRate
          )
        : null,
    });
  }, [
    name,
    animation,
    idleSpriteTexture,
    runningSpriteTexture,
    attackSpriteTexture,
  ]);

  // Animate based on the current state
  useFrame(() => {
    if (animators[animation]) {
      animators[animation].animate();
    }
  });

  const colorCode = (color: any) => {
    switch (color) {
      case "red":
        return "#f79481";
      case "green":
        return "#78fa87";
      case "blue":
        return "#6e90ff";
      case "yellow":
        return "#ffe985";
      case "orange":
        return "#ffa585";
      case "white":
        return "#ffffff";
      case "black":
        return "#000000";
      default:
        return "#ffffff";
    }
  };

  return (
    <group>
      <mesh
        position={config.mesh.position}
        scale={[direction === "left" ? -1 : 1, 1, 1]}
      >
        <planeGeometry
          args={[config.size.width * scale, config.size.height * scale, 1]}
        />
        <meshStandardMaterial
          map={animators[animation]?.texture}
          transparent={true}
          //   color={color !== "" ? colorCode(color) : "white"}
          color="black"
          opacity={0.6}
        //   opacity={opacityOptional !== null ? opacityOptional : 2}
        />
      </mesh>
      <CapsuleCollider
        args={
          config.collider.args.map((value) => value * scale) as [number, number]
        }
        position={
          config.collider.position.map((value) => value * scale) as [
            number,
            number,
            number
          ]
        }
      />
    </group>
  );
};

export default Enemy2DHoloGram;
