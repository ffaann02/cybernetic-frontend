import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { degreeNumberToRadian } from "../../../utils";
import { Mine } from "../../shared-object/object/Mine";
import { Level1DataLabRoom1 } from "../map/MapRoom1";
import { Level1DataLabRoom2 } from "../map/MapRoom2";
import Door from "../../shared-object/object/Door";
import ScifiComputer from "../../shared-object/interaction/ScifiComputer";
import Guard from "./Guard";
import { Controls } from "../../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import GlassBridge from "../../shared-object/object/GlassBridge";
import Room2 from "./room/Room2";
import { enemyPartrolProps } from "./EnemyDataProps";
import EnemyPatrolController from "../../../controllers/EnemyPatrolController";
import * as THREE from "three";
import { LaserTargetObjectProps } from "./room/LaserTargetObject";
import { LaserTargetObjectData } from "./room/LaserTargetObjectData";

export const Room = memo(({ children }) => {
  return <>{children}</>;
});

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

export const Level1DataLabEnvironment = ({
  showDialog,
  setShowDialog,
  craneUpNotAllow,
  isOpenChest,
  setIsOpenChest,
  isOpenDataCamera,
  setIsOpenDataCamera,
  enemyPatrolInScene,
  setEnemyPatrolInScene,
  setObjectCollectedList,
  setNumericalCollectedList,
  dataCollectNotify,
  isSubmitClicked,
  setIsSubmitClicked,
  craneRedBox,
}) => {
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
  } = useContext(GameContext);

  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const door01_self = useRef<any>(null);
  const door01_destination = useRef<any>(null);
  const [allowRedPad, setAllowRedPad] = useState(false);
  const [allowGreenPad, setAllowGreenPad] = useState(false);

  const [objectData, setObjectData] = useState<LaserTargetObjectProps[]>(LaserTargetObjectData);
  const [dropedObject, setDropedObject] = useState<LaserTargetObjectProps[]>([]);
  const [currentLaserTarget, setCurrentLaserTarget] = useState<string | null>(null);

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
    if(craneRedBox && craneRedBox.current && isSubmitClicked){

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
  });

  const [doorStatuses, setDoorStatuses] = useState([
    "open",
    "close",
    "open",
    "open",
  ]);

  const onColliderRedPadEnter = ({ other }) => {
    console.log(other.rigidBodyObject.name);
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "RedBox") {
        consoel.log("helloawdawd");
        setAllowRedPad(true);
      }
    }
  };

  const onColliderRedPadExit = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "RedBox") {
        setAllowRedPad(false);
      }
    }
  };

  const onColliderGreenPadEnter = ({ other }) => {
    if (other.rigidBodyObject.name) {
      if (other.rigidBodyObject.name === "GreenBox") {
        setAllowGreenPad(true);
      }
    }
  };

  const onColliderGreenPadExit = ({ other }) => {
    if (other.rigidBodyObject) {
      console.log(other.rigidBodyObject.name);
      if (other.rigidBodyObject.name === "GreenBox") {
        setAllowGreenPad(false);
      }
    }
  };


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
          <RigidBody
            colliders={false}
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
            <CuboidCollider args={[0.15, 0.4, 0.35]} position={[0,0,0]} />
            <Guard />
          </RigidBody>
          <RigidBody mass={20} name="RedBox">
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
          <RigidBody mass={20} name="GreenBox">
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
            ref={craneRedBox}
            scale={[0.25, 0.25, 0.5]}
            position={[-24, 10, -5]}
            colliders="trimesh"
            name="craneRedBox"
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
          <ScifiComputer
            position={[0, 0, -9]}
            rotation={[
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(-130),
            ]}
          />
          <RigidBody
            colliders={false}
            type="fixed"
            lockRotations
            lockTranslations
            position={items[1].position}
            scale={[1, 1, 1]}
            onCollisionEnter={onColliderRedPadEnter}
            onCollisionExit={onColliderRedPadExit}
          >
            <CuboidCollider
              args={[0.7, 0.5, 0.7]}
              position={[-6.9, 0.05, -6]}
            />
            <Item item={items[1]} key={"pad1"} opacity={0.8} />
          </RigidBody>
          <RigidBody
            colliders="trimesh"
            type="fixed"
            lockRotations
            lockTranslations
            position={items[0].position}
            scale={[1, 1, 1]}
            onCollisionEnter={onColliderGreenPadEnter}
            onCollisionExit={onColliderGreenPadExit}
          >
            <CuboidCollider
              args={[0.7, 0.5, 0.7]}
              position={[-1.2, 0.1, -6]}
            />
            <Item item={items[0]} key={"pad2"} opacity={0.8} />
          </RigidBody>

          <Level1DataLabRoom1 />
        </Room>
      )}

      {/* <Room2 /> */}
      {currentRoom === 2 && (
        <Room>
          {enemyPartrolProps.map((enemyPartrolProp, index) => (
            <EnemyPatrolController
              key={index}
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
            objectData={objectData}
            // objectData={LaserTargetObjectData}
            setObjectData={setObjectData}
            dropedObject={dropedObject}
            setDropedObject={setDropedObject}
            currentLaserTarget={currentLaserTarget}
            setCurrentLaserTarget={setCurrentLaserTarget}
            dataCollectNotify={dataCollectNotify}
          />
          <GlassBridge
            row={3}
            col={9}
            position={[132, 20, -25]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
            ]}
          />
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
          <Level1DataLabRoom2 />
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
              allowGreenPad===true && allowRedPad===true ? "open": "close"
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
