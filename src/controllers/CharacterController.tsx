import {
  CameraControls,
  KeyboardControls,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import Character2D from "../animation/Character2D";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useContext, useState, useMemo, useEffect } from "react";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import * as THREE from "three";
import { GameContext } from "../contexts/GameContext";
import {
  AnimationState,
  useCharacterAnimation,
} from "../hooks/useCharacterAnimation";
import useAudio from "../hooks/useAudio";

export enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  coding = "coding",
  interact = "interact",
  ESC = "ESC",
  L = "L",
  E = "E",
  G = "G",
}

interface CharacterControllerProps {
  spawnPosition?: [number, number, number];
}

const CharacterController: React.FC<CharacterControllerProps> = ({
  spawnPosition,
}) => {
  const controls = useRef<any>(null);
  const firstPerson = useRef<any>(null);
  const character = useRef<any>(null);
  const isOnFloor = useRef(true);
  const jumpCooldown = useRef(false);

  const {
    speed,
    currentCamera,
    isCoding,
    setIsCoding,
    currentHit,
    isInteracting,
    setIsInteracting,
    isUsingSearch,
    setIsUsingSearch,
    mines,
    setMines,
    cooldowns,
    playerRigidBody,
    isUsingSecurityCamera,
    isCarryingObject,
    isUsingTurret,
    setIsUsingTurret,
    energy,
    setEnergy,
    isDeath,
    setIsDeath
  } = useContext(GameContext);

  const [direction, setDirection] = useState<"left" | "right">("right");
  
  useEffect(()=>{

  })

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
  const interactPressed = useKeyboardControls(
    (state) => state[Controls.interact]
  );
  const escPressed = useKeyboardControls((state) => state[Controls.ESC]);
  const skillLPressed = useKeyboardControls((state) => state[Controls.L]);

  const rotateLeftPressed = useKeyboardControls(
    (state) => state[Controls.left]
  );
  const rotateRightPressed = useKeyboardControls(
    (state) => state[Controls.right]
  );
  const rotateUpPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  ); // Assuming 'forward' is used for rotating up
  const rotateDownPressed = useKeyboardControls(
    (state) => state[Controls.backward]
  );

  const { animationState, setAnimationState, updateAnimationState } =
    useCharacterAnimation();
  const jumpSound = useAudio("/soundfx/character/jump.mp3", 0.5);

  const [codingCooldown, setCodingCooldown] = useState(false);

  const handleMovement = (delta: number) => {
    const onAirFraction = isOnFloor.current ? 1 : 0.3;

    const impulse = new THREE.Vector3();

    if (
      forwardPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret && !isDeath
    ) {
      impulse.z -= speed * delta * onAirFraction;
    }
    if (
      backwardPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret && !isDeath
    ) {
      impulse.z += speed * delta * onAirFraction;
      // console.log(vec3(playerRigidBody.current.translation()).z);
    }
    if (
      leftPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret && !isDeath
    ) {
      setDirection("left");
      impulse.x -= speed * delta * onAirFraction;
    }

    if (
      rightPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret && !isDeath
    ) {
      setDirection("right");
      impulse.x += speed * delta * onAirFraction;
    }

    if (isCarryingObject) {
      setAnimationState(AnimationState.Picking);
    }

    if (
      jumpPressed &&
      !jumpCooldown.current &&
      isOnFloor.current &&
      !isUsingSearch &&
      !isUsingSecurityCamera &&
      !isUsingTurret && !isDeath
    ) {
      jumpCooldown.current = true;
      jumpSound();
      setAnimationState(AnimationState.Jumping);
      setTimeout(() => {
        jumpCooldown.current = false;
        setAnimationState(AnimationState.Idle);
      }, 1000);

      playerRigidBody.current.applyImpulse(
        new THREE.Vector3(impulse.x, speed * 75, impulse.z)
      );
    }

    if (codingPressed && !codingCooldown && currentHit === "computer") {
      setCodingCooldown(true);
      setIsCoding((prev) => !prev);
      setTimeout(() => setCodingCooldown(false), 500); // Adjust cooldown time as needed
    }

    if (codingPressed && !codingCooldown && currentHit === "assistant-bot") {
      setCodingCooldown(true);
      setIsInteracting((prev) => !prev);
      setTimeout(() => setCodingCooldown(false), 500); // Adjust cooldown time as needed
    }
    if (escPressed) {
      setIsCoding(false);
      setIsInteracting(false);
    }

    let newPos; // Declare newPos outside the if block

    if (playerRigidBody.current) {
      newPos = new THREE.Vector3(
        playerRigidBody.current.translation().x + impulse.x,
        playerRigidBody.current.translation().y,
        playerRigidBody.current.translation().z + impulse.z
      );
    } else {
      // Handle the case where rigidBody.current is null
      console.error("rigidBody.current is null");
    }

    if (newPos) {
      playerRigidBody.current.setTranslation(newPos, true);
    }

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
    // let adjustZoom = { x: 2, y: -7, z: -5 };
    if (isCoding || isInteracting) {
      adjustZoom = { x: 1, y: -4, z: -4 };
    } 
    if (isDeath){
      adjustZoom = { x: -1, y: -6, z: -6 };
    }
    // else {
    //   adjustZoom = { x: 0, y: 0, z: 0 };
    // }

    if (isCarryingObject) {
      adjustZoom = { x: -1, y: -1, z: -3 };
    }

    if (controls.current && playerRigidBody.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 10 : 8;
      const cameraDistanceZ = window.innerWidth < 1024 ? 14 : 12;
      const playerWorldPos = vec3(playerRigidBody?.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y + cameraDistanceY + 7 + adjustZoom.y,
        playerWorldPos.z + cameraDistanceZ + 3 + adjustZoom.z,
        playerWorldPos.x + 1 + adjustZoom.x,
        playerWorldPos.y + 3,
        playerWorldPos.z - 8 + adjustZoom.z,
        true
      );
    }

    if (isUsingSearch && firstPerson.current) {
      const playerWorldPos = vec3(playerRigidBody.current.translation());
      // Define the base aim point, which could be directly in front of the camera
      let aimX = playerWorldPos.x + 2.25;
      let aimY = playerWorldPos.y + 5.25; // Base elevation
      let aimZ = playerWorldPos.z + 4.5; // Base depth

      const cameraRotationSpeed = 2; // Adjust this value as needed for sensitivity

      // Adjust aim point based on keyboard input
      if (rotateLeftPressed) {
        aimX -= cameraRotationSpeed;
      }
      if (rotateRightPressed) {
        aimX += cameraRotationSpeed;
      }
      if (rotateUpPressed) {
        aimY += cameraRotationSpeed;
      }
      if (rotateDownPressed) {
        console.log("hello down");
        aimY -= cameraRotationSpeed;
      }

      // Use setLookAt to orient the camera towards the new aim point
      firstPerson.current.setLookAt(aimX, aimY, aimZ, aimX, aimY, aimZ, true);
    }
  };

  const [useItemCooldown, setUseItemCooldown] = useState(false);
  const handleUseItem = () => {
    if (skillLPressed && !isCoding && !isInteracting && !useItemCooldown) {
      // Get the current position of the player
      const currentPosition = vec3(playerRigidBody.current.translation());

      // Create a new mine object
      const newMine = {
        position: currentPosition,
        // Add any other properties you need for the mine
      };

      // Update the mines state to include the new mine
      setMines((prevMines) => [...prevMines, newMine]);
      setUseItemCooldown(true); // Start cooldown
      setTimeout(() => setUseItemCooldown(false), 1000); // Reset cooldown after 1 second
    }
  };

  useFrame((_, delta) => {
    cameraFollow();
    handleMovement(delta);
    handleUseItem();
  });

  const [lastCollisionTime, setLastCollisionTime] = useState(0);
  const collisionDelay = 1000; // 1 second delay

  return (
    <group>
      {currentCamera === 1 &&
        !isUsingSecurityCamera &&
        !isUsingSearch &&
        !isUsingTurret && <CameraControls ref={controls} />}
      {isUsingSearch && <CameraControls ref={firstPerson} />}
      <RigidBody
        name="player"
        ref={playerRigidBody}
        colliders={false}
        linearDamping={10}
        position={spawnPosition ? spawnPosition : [-2, 3, 2]}
        lockRotations
        mass={50}
        gravityScale={9.8}
        onCollisionEnter={({ other }) => {
          const currentTime = Date.now();
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name.includes("checkpoint")
          ) {
            console.log(other.rigidBodyObject.name);
          }
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "spiker-danger"
          ) {
            if (currentTime - lastCollisionTime >= collisionDelay) {
              setEnergy((prev) => Math.max(prev - 1, 0));
              setLastCollisionTime(currentTime);
            }
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
            position={[0, 4, 0]}
          />
        </group>
        <mesh castShadow position={[-0.5, 4, 0.5]} scale={[1, 0.1, 0.75]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial transparent={true} opacity={0} />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default CharacterController;
