import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { Home } from "../../map/Home";
import { Item } from "./shared/Item";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import Wall from "./shared/Wall";
import { ItemWithUrl } from "./shared/ItemWithUrl";
import Computer from "./shared/Computer";
import { degreeNumberToRadian } from "../../utils";
import { Tutorial } from "../../map/Tutorial";
import FloatingCheckpoint from "./shared/FloatingCheckpoint";
import { Mine } from "./shared/Mine";
import {
  Level1DataLab,
  Level1DataLabRoom1,
} from "../../map/Level1-DataLab-Room1";
import Door from "./shared/Door";
import ScifiComputer from "./shared/ScifiComputer";
import Guard from "./shared/Guard";
import { Controls } from "../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import GlassBridge from "./shared/GlassBridge";
import { Level1DataLabRoom2 } from "../../map/Level1-DataLab-Room2";

const items = [
  {
    name: "LandingPad",
    position: [-1.2, -0.5, -6],
    rotation: -45,
    fileType: "glb",
    scale: [100, 100, 100],
    color: "green",
  },
  {
    name: "LandingPad",
    position: [-6.8, -0.5, -6],
    rotation: 1,
    fileType: "glb",
    scale: [120, 100, 120],
    color: "red",
  },
];

export const Level1DataLabEnvironment = ({
  showDialog,
  setShowDialog,
}) => {
  const [lastPressTime, setLastPressTime] = useState(0);

  const { currentCamera, currentHit, setCurrentHit, mines, setMines, playerRigidBody} =
    useContext(GameContext);

  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const enterDoorRef = useRef();

  useFrame(() => {
    if (ePressed && currentHit === "level1-data-guard-red") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        setShowDialog((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }
  });

  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={8}
        scale={10}
        castShadow
        shadow-mapSize-height={4096}
        shadow-mapSize-width={4096}
        rotation={[0, 0, 0]}
        position={[-2, 8, 2]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <GlassBridge
        row={3}
        col={9}
        position={[132, -2, -25]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
          degreeNumberToRadian(0),
        ]}
      />

      {items.map((item, index) => (
        <RigidBody
          colliders="trimesh"
          type="fixed"
          lockRotations
          lockTranslations
          position={item.position}
          scale={[1, 1, 1]}
        >
          <Item item={item} key={index} opacity={0.8} />
        </RigidBody>
      ))}

      {/* <Guard/> */}
      <RigidBody
        colliders="cuboid"
        name="level1-data-guard-red"
        lockRotations
        lockTranslations
        type="fixed"
        position={[-20, 3.5, 2]}
        scale={[9, 9, 9]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            setCurrentHit("level1-data-guard-red");
          }
        }}
        onCollisionExit={({ other }) => {
          setCurrentHit("");
        }}
      >
        <Guard />
      </RigidBody>
      <RigidBody mass={20}>
        <Item
          item={{
            name: "WeightBox",
            position: [-22.5, 15, 0.5],
            scale: [200, 200, 200],
            fileType: "glb",
            color: "red",
          }}
        />
      </RigidBody>
      <RigidBody mass={20}>
        <Item
          item={{
            name: "WeightBox",
            position: [-17, 4, 4],
            scale: [200, 200, 200],
            fileType: "glb",
            color: "green",
          }}
        />
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        lockRotations
        lockTranslations
        position={[132, 0, -20]}
        scale={[100, 100, 100]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(45),
        ]}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            // console.log("test");
            setCurrentHit("bridge-head-computer");
          }
        }}
        onCollisionExit={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            setCurrentHit("");
          }
        }}
      >
        <Item
          item={{
            name: "FixedPlaceComputer",
            position: [0, 0, 0],
            scale: [3, 3, 3],
            fileType: "glb",
          }}
        />
      </RigidBody>

      <Level1DataLabRoom1 />
      <Level1DataLabRoom2 enterDoorRef={enterDoorRef} />
      <RigidBody
        scale={[0.25, 0.25, 0.5]}
        position={[-24, 10, -5]}
        colliders="trimesh"
        name="crane01"
        lockRotations
        lockTranslations
        type="fixed"
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
        ]}
      >
        <mesh castShadow position={[-17, 8, -12]}>
          <boxGeometry args={[2, 2, 16]} />
          <meshStandardMaterial
            color={"yellow"}
            opacity={0.9}
            transparent={true}
          />
        </mesh>
        <mesh castShadow position={[-18, 10, -19]}>
          <boxGeometry args={[16, 16, 0.25]} />
          <meshStandardMaterial
            color={"yellow"}
            opacity={0.9}
            transparent={true}
          />
        </mesh>
        <Item
          item={{
            name: "crane",
            position: [-17, 8, -2],
            scale: [1, 1, 1],
            fileType: "fbx",
          }}
          opacity={0.9}
        />
      </RigidBody>

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} />
      ))}
      <Door
        doorname="secure-door-01"
        destinationObject={enterDoorRef}
        rigidBody={playerRigidBody}
      />
      <ScifiComputer />

      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};
