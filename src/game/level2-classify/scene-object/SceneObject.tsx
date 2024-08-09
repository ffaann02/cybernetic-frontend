import { Box, Environment, useKeyboardControls } from "@react-three/drei";
import { MapRoom1 } from "../map/MapRoom1";
import { degreeNumberToRadian } from "../../../utils";
import { useContext, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import Door from "../../shared-object/object/Door";
import { MapRoom2 } from "../map/MapRoom2";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import Room from "../../shared-object/Room";
import Room1 from "./room1/Room1";
import { Item } from "../../shared-object/object/Item";
import { useFrame } from "@react-three/fiber";
import { Controls } from "../../../controllers/CharacterController";
import Room2 from "./room2/Room2";
import Room3 from "./room3/Room3";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { MapRoom3 } from "../map/MapRoom3";
import { useLevel2Context } from "../../../contexts/SceneContext/Level2Context";

const SceneObject = ({
  currentRoom,
  setCurrentRoom,
  door01_destination,
  door01_back,
  door02_destination,
  door02_back,
}) => {
  const {
    playerRigidBody,
    currentHit,
    setCurrentHit,
    setIsInteracting,
    setIsUsingSecurityCamera,
  } = useContext(GameContext);
  const {
    isOpenGlassClassifier,
    setIsOpenGlassClassifier,
    isActivateScanner,
    setIsActivateScanner,
    currentComputerGlassTest,
    setCurrentComputerGlassTest,
    isOpenGlassTest,
    setIsOpenGlassTest,
    resetTrigger,
    setResetTrigger,
    dangerPattern,
    setDangerPattern,
    ufoActiveList,
    setUfoActiveList,
    glassParameters,
    setGlassParameters,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    dataCollectNotify,
  } = useLevel2Context();
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
          <Room1 />
          <MapRoom1 />
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
          <Room2 />
          <MapRoom2 />
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
          <Room3 />
          <MapRoom3 />
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
export default SceneObject;