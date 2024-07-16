import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { RigidBody } from "@react-three/rapier";
import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { degreeNumberToRadian } from "../../../utils";
import { Mine } from "../../shared-object/object/Mine";
import { Level1DataLabRoom1 } from "../map/Level1-DataLab-Room1";
import { Level1DataLabRoom2 } from "../map/Level1-DataLab-Room2";
import Door from "../../shared-object/object/Door";
import ScifiComputer from "../../shared-object/interaction/ScifiComputer";
import Guard from "./Guard";
import { Controls } from "../../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import GlassBridge from "../../shared-object/object/GlassBridge";

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

export const Level1DataLabEnvironment = ({ showDialog, setShowDialog }) => {
  const [lastPressTime, setLastPressTime] = useState(0);

  const {
    currentCamera,
    currentHit,
    setCurrentHit,
    mines,
    setMines,
    playerRigidBody,
  } = useContext(GameContext);

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

  const [doorStatuses, setDoorStatuses] = useState([
    "open",
    "opes",
    "open",
    "open",
  ]);

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
        position={[-8, 0, -15]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
          degreeNumberToRadian(0),
        ]}
        status={doorStatuses[0]}
      />

      <Door
        doorname="secure-door-02"
        destinationObject={enterDoorRef}
        rigidBody={playerRigidBody}
        position={[135.5, 0.1, -54]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
          degreeNumberToRadian(0),
        ]}
        status={doorStatuses[1]}
      />

      <Door
        doorname="secure-door-01-back"
        destinationObject={enterDoorRef}
        rigidBody={playerRigidBody}
        position={[129.5, 0.1, -14]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        status={doorStatuses[1]}
      />

      <ScifiComputer
        position={[0, 0, -9]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-130),
        ]}
      />

      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};
