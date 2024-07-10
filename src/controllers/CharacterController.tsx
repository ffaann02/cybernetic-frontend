import {
  CameraControls,
  KeyboardControls,
  useKeyboardControls,
} from "@react-three/drei";
import Character2D from "../game_object/Character2D";
import { useRef, useContext, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import * as THREE from "three";
import { GameContext } from "../contexts/GameContext";
import {
  AnimationState,
  useCharacterAnimation,
} from "../hooks/useCharacterAnimation";
import useAudio from "../hooks/useAudio";

export enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  jump = 'jump',
  coding = 'coding',
  interact = 'interact',
  ESC = 'ESC'
}

const CharacterController: React.FC = () => {
  const controls = useRef<any>(null);
  const character = useRef<any>(null);
  const rigidBody = useRef<any>(null);
  const isOnFloor = useRef(true);
  const jumpCooldown = useRef(false);

  const { speed, camera, isCoding, setIsCoding, currentHit, isInteracting, setIsInteracting } =
    useContext(GameContext);
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

  const codingPressed = useKeyboardControls((state) => state[Controls.coding]);
  const interactPressed = useKeyboardControls((state) => state[Controls.interact]);
  const escPressed = useKeyboardControls((state) => state[Controls.ESC]);

  const { animationState, setAnimationState, updateAnimationState } =
    useCharacterAnimation();
  const jumpSound = useAudio("jump", 0.5);

  const [codingCooldown, setCodingCooldown] = useState(false);

  const handleMovement = (delta: number) => {
    const onAirFraction = isOnFloor.current ? 1 : 0.3;

    const impulse = new THREE.Vector3();

    if (forwardPressed && !isCoding && !isInteracting) {
      impulse.z -= speed * delta * onAirFraction;
    }
    if (backwardPressed && !isCoding && !isInteracting) {
      impulse.z += speed * delta * onAirFraction;
    }
    if (leftPressed && !isCoding && !isInteracting) {
      setDirection("left");
      impulse.x -= speed * delta * onAirFraction;
    }

    if (rightPressed && !isCoding && !isInteracting) {
      setDirection("right");
      impulse.x += speed * delta * onAirFraction;
    }

    if (jumpPressed && !jumpCooldown.current && isOnFloor.current) {
      jumpCooldown.current = true;
      jumpSound();
      setAnimationState(AnimationState.Jumping);
      setTimeout(() => {
        jumpCooldown.current = false;
        setAnimationState(AnimationState.Idle);
      }, 1000);

      rigidBody.current.applyImpulse(
        new THREE.Vector3(impulse.x, speed * 75, impulse.z)
      );
    }

    if (codingPressed && !codingCooldown && currentHit === "computer") {
      setCodingCooldown(true);
      setIsCoding(prev => !prev);
      setTimeout(() => setCodingCooldown(false), 500); // Adjust cooldown time as needed
    }

    if (codingPressed && !codingCooldown && currentHit === "assistant-bot") {
      setCodingCooldown(true);
      setIsInteracting(prev => !prev);
      setTimeout(() => setCodingCooldown(false), 500); // Adjust cooldown time as needed
    }
    if (escPressed) {
      setIsCoding(false);
      setIsInteracting(false);
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
    let adjustZoom = { x: 0, y: 0, z: 0 };
    if (isCoding || isInteracting) {
      adjustZoom = { x: 1, y: -4, z: -4 };
    }
    else{
      adjustZoom = { x: 0, y: 0, z: 0 };
    }

    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 10 : 8;
      const cameraDistanceZ = window.innerWidth < 1024 ? 14 : 12;
      const playerWorldPos = vec3(rigidBody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y + cameraDistanceY + 5 + adjustZoom.y,
        playerWorldPos.z + cameraDistanceZ + 3 + adjustZoom.z,
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y - 2,
        playerWorldPos.z - 8 + adjustZoom.z,
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
          name="player"
          ref={rigidBody}
          colliders={false}
          linearDamping={10}
          position={[2, -2, 2]}
          lockRotations
          mass={50}
          gravityScale={9.8}
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
          <mesh castShadow position={[0.5, 4, 4.3]} scale={[1, 0.1, 0.75]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial transparent={true} opacity={0} />
          </mesh>
        </RigidBody>
      </group>
  );
};

export default CharacterController;
