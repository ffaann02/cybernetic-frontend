import { CameraControls, useKeyboardControls } from "@react-three/drei";
import Character2D from "../game_object/Character2D";
import { useRef, useContext, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import * as THREE from "three";
import { GameContext } from "../contexts/GameContext";
import { useCharacterAnimation } from "../hooks/useCharacterAnimation";
import useAudio from "../hooks/useAudio";

export const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  jump: "jump",
};

const CharacterController: React.FC = () => {
  const controls = useRef<any>(null);
  const character = useRef<any>(null);
  const rigidBody = useRef<any>(null);
  const isOnFloor = useRef(false);
  const jumpCooldown = useRef(false);

  const { speed, camera } = useContext(GameContext);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backwardPressed = useKeyboardControls(
    (state) => state[Controls.backward]
  );
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const { animationState, updateAnimationState } = useCharacterAnimation();

  const jumpSound = useAudio("jump", 0.5);

  const handleMovement = (delta: number) => {
    const onAirFraction = isOnFloor.current ? 1 : 0.3;

    const impulse = new THREE.Vector3();

    if (forwardPressed) {
      impulse.z -= speed * delta * onAirFraction;
    }
    if (backwardPressed) {
      impulse.z += speed * delta * onAirFraction;
    }
    if (leftPressed) {
      setDirection("left");
      impulse.x -= speed * delta * onAirFraction;
    }
    if (rightPressed) {
      setDirection("right");
      impulse.x += speed * delta * onAirFraction;
    }

    if (jumpPressed && !jumpCooldown.current && isOnFloor.current) {
      jumpCooldown.current = true;
      jumpSound();
      setTimeout(() => {
        jumpCooldown.current = false;
      }, 1000);

      rigidBody.current.applyImpulse(
        new THREE.Vector3(impulse.x, speed * 75, impulse.z)
      );
    }

    const newPos = new THREE.Vector3(
      rigidBody.current.translation().x + impulse.x,
      rigidBody.current.translation().y,
      rigidBody.current.translation().z + impulse.z
    );

    rigidBody.current.setTranslation(newPos, true);

    updateAnimationState(
      forwardPressed,
      backwardPressed,
      leftPressed,
      rightPressed,
      jumpPressed,
      isOnFloor.current,
      jumpCooldown.current
    );
  };

  const cameraFollow = () => {
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 10 : 8;
      const cameraDistanceZ = window.innerWidth < 1024 ? 14 : 12;
      const playerWorldPos = vec3(rigidBody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x + 1,
        playerWorldPos.y + cameraDistanceY + 4,
        playerWorldPos.z + cameraDistanceZ + 2,
        playerWorldPos.x + 1,
        playerWorldPos.y - 2,
        playerWorldPos.z - 8,
        true
      );
    }
  };

  useFrame((_, delta) => {
    cameraFollow();
    handleMovement(delta);
  });

  return (
    <group>
      {camera === 1 && <CameraControls ref={controls} />}
      <RigidBody
        ref={rigidBody}
        colliders={false}
        linearDamping={10}
        position={[2, -2, 2]}
        lockRotations
        mass={50}
        gravityScale={9.8}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject && other.rigidBodyObject.name === "floor") {
            isOnFloor.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject && other.rigidBodyObject.name === "floor") {
            isOnFloor.current = false;
          }
        }}
      >
        <group ref={character}>
          <Character2D direction={direction} animation={animationState} />
          <CapsuleCollider
            args={[
              1, // radius
              1, // height
            ]}
            position={[1, 4, 4]}
          />
        </group>
        <mesh castShadow position={[0.75, 4, 4.25]} scale={[
          1,0.1,0.75
        ]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial transparent={true} opacity={0}/>
        </mesh>
      </RigidBody>
    </group>
  );
};

export default CharacterController;
