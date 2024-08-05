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
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing";
import { useLevel3Context } from "../../../contexts/SceneContext/Level3Context";

const SceneObject = ({
  currentRoom,
  setCurrentRoom,
  door01_destination,
  door01_back,
}) => {
  const {
    playerRigidBody,
    currentHit,
    setCurrentHit,
    setIsInteracting,
    setIsUsingSecurityCamera,
  } = useContext(GameContext);
  const {
    isOpenAudioInput,
    setIsOpenAudioInput,
    isOpenVideoFootage,
    setIsOpenVideoFootage,
    isPlayingSound,
    setIsPlayingSound,
    isOpenCD,
    setIsOpenCD,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    kaboom,
    setKaboom
  } = useLevel3Context();
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
            position={[3.5, 0, -5]}
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
            position={[-14, 0, -19.5]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
            ]}
            status={kaboom ? "open" : "close"}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
          <Room1
            parentLight={parentLight}
            speakerMeshRef={speakerMeshRef}
          />
          <MapRoom1/>
        </Room>
      )}

      {currentRoom === 2 && (
        <Room>
          <Door
            doorname="secure-door-02"
            destinationObject={door01_back}
            rigidBody={playerRigidBody}
            position={[-36, 0, 16]}
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
          <Room2
          />
          <MapRoom2/>
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
        position={[0, 0, -5]}
      ></RigidBody>
    </>
  );
};
export default SceneObject;
