import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useContext, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { degreeNumberToRadian } from "../../../utils";
import { Mine } from "../../shared-object/object/Mine";
import { MapRoom1 } from "../map/MapRoom1";
import { MapRoom2 } from "../map/MapRoom2";
import Door from "../../shared-object/object/Door";
import Guard from "./Guard";
import { Controls } from "../../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import GlassBridge from "../../shared-object/object/GlassBridge";
import Room2 from "./room/Room2";
import { enemyPartrolProps } from "./EnemyDataProps";
import EnemyPatrolController from "../../../controllers/EnemyPatrolController";
import * as THREE from "three";
import { LaserTargetObjectProps } from "./room2/LaserTargetObject";
import { LaserTargetObjectData } from "./room2/LaserTargetObjectData";
import { useLevel1Context } from "../../../contexts/SceneContext/Level1Context";
import Room from "../../shared-object/Room";
import NPC from "./room1/NPC";
import Object from "./room1/Object";


const items = [
  {
    name: "LandingPad",
    position: [-1.2, -0.3, -6],
    fileType: "glb",
    scale: [100, 100, 100],
    color: "green",
  },
  {
    name: "LandingPad",
    position: [-6.8, -0.3, -6],
    fileType: "glb",
    scale: [120, 100, 120],
    color: "red",
  },
];

const SceneObject = ({
  enemyPatrolInScene,
  setEnemyPatrolInScene,
}) => {
  const {
    showDialog,
    setShowDialog,
    craneUpNotAllow,
    isOpenChest,
    setIsOpenChest,
    isOpenDataCamera,
    setIsOpenDataCamera,
    setObjectCollectedList,
    setNumericalCollectedList,
    dataCollectNotify,
    isSubmitClicked,
    setIsSubmitClicked,
    craneRedBox,
    allowGreenPad,
    allowRedPad
  } = useLevel1Context();

  const [lastPressTime, setLastPressTime] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const [currentRoom, setCurrentRoom] = useState(1);
  const [allowCraneUp, setAllowCraneUp] = useState(false);

  const {
    currentCamera,
    currentHit,
    setCurrentHit,
    mines,
    setMines,
    playerRigidBody,
    setIsInteracting,
    setIsUsingSecurityCamera,
    isUsingSearch,
  } = useContext(GameContext);

  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const gPressed = useKeyboardControls((state) => state[Controls.G]);
  const escPressed = useKeyboardControls((state) => state[Controls.ESC]);
  const door01_self = useRef<any>(null);
  const door01_destination = useRef<any>(null);

  useFrame(() => {
    if (ePressed && currentHit === "level1-data-guard-red") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        setShowDialog((prev) => !prev);
        setIsInteracting((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }
    if (ePressed && currentHit === "Level1-Crane-Computer") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        console.log("lift crane");
        setLastPressTime(currentTime);
        if (totalWeight >= 100) {
          craneUpNotAllow.current.show({
            severity: "success",
            content: (props) => (
              <div className="flex items-center w-full">
                <div className="text-green-500 text-2xl bg-white/20 px-2 py-2 rounded-xl">
                  Total weight is enough to active. The crane is lifting up.
                </div>
              </div>
            ),
          });
          if (!allowCraneUp) {
            setAllowCraneUp(true);
          } else {
            setAllowCraneUp(false);
          }
        } else {
          craneUpNotAllow.current.show({
            severity: "error",
            content: (props) => (
              <div className="flex items-center w-full">
                <div className="text-red-400 text-2xl">
                  Total weight is not enough to lift the crane.
                </div>
              </div>
            ),
          });
          setAllowCraneUp(false);
        }
      }
    }
    if (ePressed && currentHit?.includes("Computer-camera-01")) {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        console.log("open camera");
        setIsUsingSecurityCamera((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }
    if (ePressed && currentHit?.includes("Loot")) {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        console.log("open chest");
        setIsOpenChest((prev) => !prev);
        setLastPressTime(currentTime);
        setIsInteracting((prev) => !prev);
      }
    }
    if (ePressed && currentHit === "CameraData") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        console.log("camera");
        setIsOpenDataCamera((prev) => !prev);
        setIsInteracting((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }

    if (ePressed && currentHit === "GoodBot") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        console.log("GoodBot");
        setIsInteracting((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }
    if (craneRedBox && craneRedBox.current && isSubmitClicked) {
      const currentPosition = vec3(craneRedBox.current.translation());

      const liftPerFrame = 0.08;
      const TopReachPoint = 23;
      const bottomReachPoint = 0.1;
      if (currentPosition.y < TopReachPoint) {
        craneRedBox.current.setTranslation({
          x: currentPosition.x,
          y: Math.min(currentPosition.y + liftPerFrame, TopReachPoint),
          z: currentPosition.z,
        });
      } else if (currentPosition.y > bottomReachPoint) {
        setIsSubmitClicked(false);
      }
    }
    if ((gPressed || escPressed) && isUsingSearch) {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        let imageLink = "";
        if (gPressed){
          imageLink = "/images/slime_default.png";
        }
        else{
          imageLink = "/images/SpiderHead.png"
        }
        setLastPressTime(currentTime);
        dataCollectNotify.current.show({
          unstyled: true,
          closable: false,
          life: 2000,
          content: (props) => (
              <div className="flex relative z-[100000] rounded-lg px-2.5 py-2 gap-x-2">
                <img
                  src={imageLink}
                  className="w-16 h-16 bg-white rounded-xl"
                />
                <div className="">
                  <p className="text-2xl font-semibold text-white">
                    Data Collected!
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {gPressed ? "Slime" : "Spider"} data collected.
                  </p>
                </div>
              </div>
          ),
        });
      }
    }
  });

  const [doorStatuses, setDoorStatuses] = useState([
    "open",
    "close",
    "open",
    "open",
  ]);

  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={4}
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
          <NPC />
          <Object items={items} />
          <MapRoom1 />
        </Room>
      )}

      {/* <Room2 /> */}
      {currentRoom === 2 && (
        <Room>
          {enemyPatrolInScene.map((enemyPartrolProp, index) => (
            <EnemyPatrolController
              key={index}
              id={index}
              name={enemyPartrolProp.name}
              waypoints={enemyPartrolProp.waypoints}
              angle={enemyPartrolProp.angle}
              idleTime={enemyPartrolProp.idleTime}
              chaseTimeLimit={enemyPartrolProp.chaseTimeLimit}
              patrolType={enemyPartrolProp.patrolType}
              showPath={enemyPartrolProp.showPath}
              data={enemyPartrolProp.data}
              setEnemyPatrolInScene={setEnemyPatrolInScene}
            />
          ))}
          <Room2
            totalWeight={totalWeight}
            setTotalWeight={setTotalWeight}
            allowCraneUp={allowCraneUp}
            setAllowCraneUp={setAllowCraneUp}
            setObjectCollectedList={setObjectCollectedList}
            setNumericalCollectedList={setNumericalCollectedList}
            dataCollectNotify={dataCollectNotify}
          />
          <MapRoom2 />
        </Room>
      )}

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} />
      ))}

      {currentRoom === 1 && (
        <>
          <Door
            doorname="secure-door-01"
            destinationObject={door01_destination}
            rigidBody={playerRigidBody}
            position={[6.5, 0, 11]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ]}
            status={doorStatuses[0]}
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
          <Door
            doorname="secure-door-01"
            destinationObject={door01_destination}
            rigidBody={playerRigidBody}
            position={[-8, 0, -14]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
            ]}
            status={
              allowGreenPad === true && allowRedPad === true ? "open" : "close"
            }
            type="switch-room"
            setCurrentRoom={setCurrentRoom}
            nextRoom={2}
          />
        </>
      )}
      <RigidBody
        name="destination-from-door01"
        colliders="trimesh"
        type="fixed"
        position={[-45, 0, -7]}
        ref={door01_destination}
      ></RigidBody>

      {currentRoom === 2 && (
        <Door
          doorname="secure-door-01-back"
          destinationObject={door01_self}
          rigidBody={playerRigidBody}
          position={[-49.5, 0, -8]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
          status={doorStatuses[0]}
          type="switch-room"
          setCurrentRoom={setCurrentRoom}
          nextRoom={1}
        />
      )}

      <RigidBody
        name="destination-from-door01-back"
        colliders="trimesh"
        type="fixed"
        position={[3, 0, 10.5]}
        ref={door01_self}
      ></RigidBody>

      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};

export default SceneObject;