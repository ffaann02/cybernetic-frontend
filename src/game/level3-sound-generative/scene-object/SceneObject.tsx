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
import { Mine } from "../../shared-object/object/Mine";

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
    setIsShowLevelResult,
    setPlayTimeInLevel,
    mines,
    setMines,
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
    setKaboom,
    nextLevelDoor,
    setNextLevelDoor,
    lastUpdateTimeRef,
    level3PlayTime,
    setLevel3PlayTime,
  } = useLevel3Context();
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);

  const [lastPressTime, setLastPressTime] = useState(0);
  const parentLight = useRef();
  const speakerMeshRef = useRef();

  useFrame(() => {
    const currentTimer = Date.now();
    if (lastUpdateTimeRef.current !== null) {
      const deltaTime = currentTimer - lastUpdateTimeRef.current;
      if (deltaTime > 500) {
        lastUpdateTimeRef.current = currentTimer // Update the last update time
        setLevel3PlayTime((prev) => prev + 0.5);
      }
    }
  })

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

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} />
      ))}


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
          <RigidBody
            colliders="trimesh"
            mass={0}
            type="fixed"
            name="secure-door-next-level"
            position={[-14, 0, -19.5]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
            ]}
            scale={[2, 3, 3]}
            onCollisionEnter={({ other }) => {
              if (
                other.rigidBodyObject &&
                other.rigidBodyObject.name === "player" && kaboom
              ) {
                // console.log("hello");
                setPlayTimeInLevel(level3PlayTime);
                setIsShowLevelResult(true);
              }
            }}
            onCollisionExit={({ other }) => {
              setCurrentHit("");
              // setIsShowLevelResult(false);
            }}
          >
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[0.3, 2, 0.9]} />
              <meshStandardMaterial
                color={!kaboom ? "red" : "green"}
                transparent={true}
                opacity={0.5}
              />
            </mesh>
            <Item
              item={{
                name: "door-border",
                position: [0, 0, 0],
                fileType: "glb",
              }}
              isOutlined={true}
            />
          </RigidBody>
          <Room1 parentLight={parentLight} speakerMeshRef={speakerMeshRef} />
          <MapRoom1 />
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
          <Room2 />
          <MapRoom2 />
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
