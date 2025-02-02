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
import io from "socket.io-client";
import { degreeNumberToRadian } from "../utils";
import SearchController from "./SearchController";
import { useCharacterInventory } from "../hooks/useCharacterInventory";

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
  I = "I",
}

interface CharacterControllerProps {
  spawnPosition?: [number, number, number];
  isSelf?: boolean;
  userId?: string;
  roomId?: string;
  isOnline?: boolean;
  onlinePosition?: any;
}

const CharacterController: React.FC<CharacterControllerProps> = ({
  spawnPosition,
  isSelf = true,
  userId,
  roomId,
  isOnline = false,
  onlinePosition
}) => {
  const controls = useRef<any>(null);
  const firstPerson = useRef<CameraControls>(null);
  // const aimDirection = useRef(new THREE.Vector3(2.25, 0, -1)); // Initial aim direction
  const character = useRef<any>(null);
  const isOnFloor = useRef(true);
  const jumpCooldown = useRef(false);
  // console.log(isSelf);

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
    setIsDeath,
    setIsPaused,
    searchAimDirection,
    isOpenInventory,
    setIsOpenInventory,
    isPaused,
    isShowLevelResult,
  } = useContext(GameContext);

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
  const interactPressed = useKeyboardControls(
    (state) => state[Controls.interact]
  );
  const escPressed = useKeyboardControls((state) => state[Controls.ESC]);
  const skillLPressed = useKeyboardControls((state) => state[Controls.L]);
  const openInventoryPressed = useKeyboardControls((state) => state[Controls.I]);

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
  const [lastPressTime, setLastPressTime] = useState(0);

  const { isInventoryItemRemaining, decreaseInventoryItemQuantityByName } = useCharacterInventory();

  const handleMovement = (delta: number) => {
    const onAirFraction = isOnFloor.current ? 1 : 0.3;

    const impulse = new THREE.Vector3();

    if (
      forwardPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret &&
      !isDeath &&
      !isUsingSearch &&
      !isOpenInventory &&
      !isPaused &&
      !isShowLevelResult
    ) {
      impulse.z -= speed * delta * onAirFraction;
    }
    if (
      backwardPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret &&
      !isDeath &&
      !isUsingSearch &&
      !isOpenInventory &&
      !isPaused &&
      !isShowLevelResult
    ) {
      impulse.z += speed * delta * onAirFraction;
      // console.log(vec3(playerRigidBody.current.translation()).z);
    }
    if (
      leftPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret &&
      !isDeath &&
      !isUsingSearch &&
      !isOpenInventory &&
      !isPaused &&
      !isShowLevelResult
    ) {
      setDirection("left");
      impulse.x -= speed * delta * onAirFraction;
    }

    if (
      rightPressed &&
      !isCoding &&
      !isInteracting &&
      !isUsingSecurityCamera &&
      !isUsingTurret &&
      !isDeath &&
      !isUsingSearch &&
      !isOpenInventory &&
      !isPaused &&
      !isShowLevelResult
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
      !isUsingTurret &&
      !isDeath &&
      !isOpenInventory &&
      !isPaused && 
      !isShowLevelResult
    ) {
      jumpCooldown.current = true;
      jumpSound();
      // setAnimationState(AnimationState.Jumping);
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

    // if (codingPressed && !codingCooldown && currentHit === "assistant-bot") {
    //   setCodingCooldown(true);
    //   setIsInteracting((prev) => !prev);
    //   setTimeout(() => setCodingCooldown(false), 500); // Adjust cooldown time as needed
    // }
    // if (escPressed) {
    //   setIsCoding(false);
    //   setIsInteracting(false);
    //   setIsPaused((prev)=>!prev)
    // }

    if (escPressed) {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsCoding(false);
        setIsInteracting(false);
        setIsPaused((prev) => !prev)
        setLastPressTime(currentTime);
      }
    }

    let newPos; // Declare newPos outside the if block
    let onlinePos;

    if (playerRigidBody.current) {
      const currentPosition = vec3(playerRigidBody.current.translation());
      newPos = new THREE.Vector3(
        playerRigidBody.current.translation().x + impulse.x,
        playerRigidBody.current.translation().y,
        playerRigidBody.current.translation().z + impulse.z
      );

      // console.log(newPos);
      // console.log(currentPosition);
      const distance = Math.sqrt(
        Math.pow(newPos.x - currentPosition.x, 2) +
        Math.pow(newPos.y - currentPosition.y, 2) +
        Math.pow(newPos.z - currentPosition.z, 2)
      );
      // console.log(`Distance: ${distance}`);

      // const distance = newPos.distanceTo(currentPosition);
      // console.log(`Distance: ${distance}`);
      if (roomId && roomId !== "" && distance > 0.15 && isSelf) {
        const serverEndpoint = "http://localhost:3001";
        const socket = io(serverEndpoint, {
          withCredentials: true,
          transports: ["websocket", "polling"],
        });
        const positionArray = newPos.toArray();
        const userData = {
          userId: userId,
          position: positionArray,
          direction: direction,
          animation: "Jumping",
        };

        socket.emit("update_player", { roomId, userData });
        if (newPos && playerRigidBody.current && isOnline) {
          // console.log(onlinePos);
          playerRigidBody.current.setTranslation(newPos, true);
        }
      }
      else if (!isSelf) {
        playerRigidBody.current.setTranslation(onlinePos);
      }
      if (newPos && playerRigidBody.current && !isOnline) {
        // console.log(onlinePos);
        playerRigidBody.current.setTranslation(newPos, true);
      }
    } else {
      // Handle the case where rigidBody.current is null
      console.error("rigidBody.current is null");
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
    if (isDeath) {
      adjustZoom = { x: -1, y: -6, z: -6 };
    } else {
      adjustZoom = { x: 0, y: 0, z: 0 };
    }

    if (isCarryingObject) {
      adjustZoom = { x: -1, y: -1, z: -3 };
    }
    if (isCoding || isInteracting) {
      adjustZoom = { x: 1, y: -4, z: -4 };
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

    if (isUsingSearch && firstPerson.current && playerRigidBody.current) {
      const playerWorldPos = vec3(playerRigidBody.current.translation());

      // Define the camera position on the player's head
      const cameraHeight = 5; // Adjust as needed to match head level
      const cameraPosX = playerWorldPos.x;
      const cameraPosY = playerWorldPos.y + cameraHeight;
      const cameraPosZ = playerWorldPos.z;

      const cameraRotationSpeed = 0.02; // Adjust this value for sensitivity

      // Create a new vector to update aim direction based on keyboard input
      const deltaAim = new THREE.Vector3();

      if (rotateLeftPressed) {
        deltaAim.x += cameraRotationSpeed;
      }
      if (rotateRightPressed) {
        deltaAim.x -= cameraRotationSpeed;
      }
      if (rotateUpPressed) {
        deltaAim.y += cameraRotationSpeed;
      }
      if (rotateDownPressed) {
        deltaAim.y -= cameraRotationSpeed;
      }

      if (searchAimDirection && searchAimDirection.current) {
        // Update the aim direction by applying the rotation
        searchAimDirection.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaAim.x);

        // Calculate camera's right direction for proper up-down rotation
        const cameraRight = new THREE.Vector3().crossVectors(
          searchAimDirection.current,
          new THREE.Vector3(0, 1, 0)
        ).normalize();

        // Rotate around the camera's right axis for up-down movement
        searchAimDirection.current.applyAxisAngle(cameraRight, deltaAim.y);

        // Calculate the aim point based on the player's position and updated aim direction
        const aimPoint = new THREE.Vector3(cameraPosX, cameraPosY, cameraPosZ).add(
          searchAimDirection.current
        );

        // Use setLookAt to orient the camera towards the new aim point
        firstPerson.current.setLookAt(
          cameraPosX,
          cameraPosY,
          cameraPosZ,
          aimPoint.x,
          aimPoint.y,
          aimPoint.z,
          true
        );
      }
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

      console.log(isInventoryItemRemaining("Landmine bomber"));
      if (isInventoryItemRemaining("Landmine bomber")) {
        // Update the mines state to include the new mine
        setMines((prevMines) => [...prevMines, newMine]);
        setUseItemCooldown(true); // Start cooldown
        decreaseInventoryItemQuantityByName("Landmine bomber", 1);
        setTimeout(() => setUseItemCooldown(false), 1000); // Reset cooldown after 1 second
      }
    }
    if (openInventoryPressed && !isPaused && !isCoding && !isInteracting) {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setLastPressTime(currentTime);
        setIsOpenInventory((prev) => !prev);
      }
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
          {!isUsingSearch &&
            <Character2D direction={direction} animation={animationState} />
          }
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
      {isUsingSearch &&
        <SearchController firstPersonCameraRef={firstPerson} />
      }
    </group>
  );
};

export default CharacterController;
