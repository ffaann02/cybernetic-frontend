import { Box, Environment, useKeyboardControls } from "@react-three/drei";
import { Level2ClassifyRoom1 } from "../map/Level2-Classify-Room1";
import { degreeNumberToRadian } from "../../../utils";
import { useContext, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import Door from "../../shared-object/object/Door";
import { Level2ClassifyRoom2 } from "../map/Level2-Classify-Room2";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Room } from "../../level1-datalab/scene-object/Level1-DataLab";
import Room1 from "./room1/Room1";
import { Item } from "../../shared-object/object/Item";
import { useFrame } from "@react-three/fiber";
import { Controls } from "../../../controllers/CharacterController";
import Room2 from "./room2/Room2";
import Room3 from "./room3/Room3";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { Level2ClassifyRoom3 } from "../map/Level2-Classify-Room3";

const Level2ClassifyEnvironment = ({
  currentRoom,
  setCurrentRoom,
  door01_destination,
  door01_back,
  isOpenGlassClassifier,
  setIsOpenGlassClassifier,
  isActivateScanner,
  setIsActivateScanner,
  dataCollectNotify,
  door02_destination,
  door02_back,
  isOpenGlassTest,
  setIsOpenGlassTest,
  currentComputerGlassTest,
  setCurrentComputerGlassTest,
  resetTrigger,
  setResetTrigger,
  dangerPattern,
  setDangerPattern,
  ufoActiveList,
  setUfoActiveList,
}) => {
  const {
    playerRigidBody,
    currentHit,
    setCurrentHit,
    setIsInteracting,
    setIsUsingSecurityCamera,
  } = useContext(GameContext);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);

  const [lastPressTime, setLastPressTime] = useState(0);
  const parentLight = useRef();
  const speakerMeshRef = useRef();

  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={7}
        scale={100}
        castShadow
        shadow-mapSize-height={4096 * 3}
        shadow-mapSize-width={4096 * 3}
        rotation={[0, 0, 0]}
        position={[-2, 8, 2]}
        shadow-camera-left={-20}
        shadow-camera-right={40}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {currentRoom === 1 && (
        <Room>
          <Door
            doorname="secure-door-01"
            destinationObject={door01_destination}
            rigidBody={playerRigidBody}
            position={[3.5, 0, 12]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
            status={"open"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
          <Door
            doorname="secure-door-next-level"
            destinationObject={door01_destination}
            rigidBody={playerRigidBody}
            position={[-36, 10, -11.5]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
            status={"close"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
          <Room1
            isOpenGlassClassifier={isOpenGlassClassifier}
            setIsOpenGlassClassifier={setIsOpenGlassClassifier}
            isActivateScanner={isActivateScanner}
            setIsActivateScanner={setIsActivateScanner}
          />
          <Level2ClassifyRoom1 />
        </Room>
      )}

      {currentRoom === 2 && (
        <Room>
          <Door
            doorname="secure-door-02"
            destinationObject={door01_back}
            rigidBody={playerRigidBody}
            position={[-36, 0, 15]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
            status={"open"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={1}
          />
          <Door
            doorname="secure-door-03"
            destinationObject={door02_destination}
            rigidBody={playerRigidBody}
            position={[0, 20.2, -20]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
            ]}
            status={"open"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={3}
          />
          <Room2 dataCollectNotify={dataCollectNotify} />
          <Level2ClassifyRoom2 />
        </Room>
      )}

      {currentRoom === 3 && (
        <Room>
          <Door
            doorname="secure-door-03-back"
            destinationObject={door02_back}
            rigidBody={playerRigidBody}
            position={[-36, 0, 15]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
            status={"open"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
          <Room3
            isOpenGlassTest={isOpenGlassTest}
            setIsOpenGlassTest={setIsOpenGlassTest}
            currentComputerGlassTest={currentComputerGlassTest}
            setCurrentComputerGlassTest={setCurrentComputerGlassTest}
            resetTrigger={resetTrigger}
            setResetTrigger={setResetTrigger}
            dangerPattern={dangerPattern}
            setDangerPattern={setDangerPattern}
            ufoActiveList={ufoActiveList}
                setUfoActiveList={setUfoActiveList}
          />
          <Level2ClassifyRoom3 />
        </Room>
      )}

      <RigidBody
        type="fixed"
        name="door1-enter"
        ref={door01_destination}
        position={[-32, 0, 16]}
      ></RigidBody>
      <RigidBody
        type="fixed"
        name="door1-back"
        ref={door01_back}
        position={[0, 0, 8]}
      ></RigidBody>
      <RigidBody
        type="fixed"
        name="door2-enter"
        ref={door02_destination}
        position={[-30, 0, 16]}
      ></RigidBody>
      <RigidBody
        type="fixed"
        name="door2-back"
        ref={door02_back}
        position={[0, 22, -14]}
      ></RigidBody>
    </>
  );
};
export default Level2ClassifyEnvironment;
