import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import Wall from "../../shared-object/object/Wall";
import { ItemWithUrl } from "../../shared-object/object/ItemWithUrl";
import Computer from "./shared/Computer";
import { degreeNumberToRadian } from "../../../utils";
import { Mine } from "../../shared-object/object/Mine";
import Door from "../../shared-object/object/Door";
import ScifiComputer from "../../shared-object/interaction/ScifiComputer";
import Guard from "../../level1-datalab/scene-object/Guard";
import { Controls } from "../../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import GlassBridge from "../../shared-object/object/GlassBridge";
import { Level2ImageLabRoom1 } from "../map/Level2-ImageLab-Room1";

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

export const Level2ImageLabEnvironment = ({ showDialog, setShowDialog }) => {
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
    "close",
    "open",
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

      <Level2ImageLabRoom1 />

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} />
      ))}

      <RigidBody
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
        ]}
        position={[-22.5, 4.5, -0]}
      >
        <Item
          item={{
            name: "SecurityKeypad",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          key={1}
        />
      </RigidBody>

      <Door
        doorname="secure-door-01"
        destinationObject={enterDoorRef}
        rigidBody={playerRigidBody}
        position={[-23, 0, 2]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        status={doorStatuses[0]}
      />

      <ScifiComputer
        position={[4, 0, -9]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-150),
        ]}
      />

      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};
