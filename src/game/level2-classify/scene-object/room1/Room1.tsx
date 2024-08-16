import { useFrame } from "@react-three/fiber";
import {
  ConeCollider,
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { useContext, useRef, useState, useEffect } from "react";
import { BlurPass, Resizer, KernelSize, Effect } from "postprocessing";
import { GameContext } from "../../../../contexts/GameContext";
import {
  Bloom,
  EffectComposer,
  SelectiveBloom,
} from "@react-three/postprocessing";
import {
  Box,
  Circle,
  Cone,
  Cylinder,
  Outlines,
  Sky,
  Sparkles,
  Sphere,
  Stars,
  useKeyboardControls,
} from "@react-three/drei";
import { Controls } from "../../../../controllers/CharacterController";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import { Color, ConeGeometry, Light, MeshStandardMaterial } from "three";
import EnemyPatrolController from "../../../../controllers/EnemyPatrolController";
import { enemyPatrolProps } from "../EnemyDataProps";
import SpeakerObject from "./SpeakerObject";
import FlameBox from "./FlameBox";
import Spike from "./Spike";
import GlassBridge from "../../../shared-object/object/GlassBridge";
import { useLevel2Context } from "../../../../contexts/SceneContext/Level2Context";
import GolemPatrollController from "../../../../controllers/GolemPatrollController";
import { GolemPatrollLevel2 } from "./GolemPatrollLevel2";

const bloomColor = new Color("#ff0000");
bloomColor.multiplyScalar(1.2);

const Room1 = ({
}) => {

  const {
    isOpenGlassClassifier,
    setIsOpenGlassClassifier,
    isActivateScanner,
    setIsActivateScanner,
    resetTrigger,
    setResetTrigger
  } = useLevel2Context();

  const {
    currentHit,
    setCurrentHit,
    setIsInteracting,
    isInteracting,
    playerRigidBody,
    isCarryingObject,
    setIsCarryingObject,
    isUsingSecurityCamera,
    setIsUsingSecurityCamera,
  } = useContext(GameContext);

  const wPressed = useKeyboardControls((state) => state[Controls.forward]);
  const sPressed = useKeyboardControls((state) => state[Controls.backward]);
  const aPressed = useKeyboardControls((state) => state[Controls.left]);
  const dPressed = useKeyboardControls((state) => state[Controls.right]);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const spacePressed = useKeyboardControls((state) => state[Controls.jump]);
  const [reAlign, setReAlign] = useState(null);
  const [isPredict, setIsPredict] = useState(false);
  const [lastPressTime, setLastPressTime] = useState(0);
  const UFO = useRef();
  const [ufoRotationY, setUfoRotationY] = useState(0);
  const [ufoPositionX, setUfoPositionX] = useState(-8);
  const [stopTimer, setStopTimer] = useState(null);
  const [glassBridges, setGlassBridges] = useState([
    {
      row: 3,
      col: 8,
      position: [-8, 7, -7],
      rotation: [
        degreeNumberToRadian(0),
        degreeNumberToRadian(180),
        degreeNumberToRadian(0),
      ],
      timestamp: Date.now(),
    },
  ]);
  const [golemInScene, setGolemInScene] = useState(GolemPatrollLevel2);

  const onPlayerEnterGlassComputer = ({ other }) => {
    console.log("test");
    if (other.rigidBodyObject.name === "player") {
      console.log("player is here");
      setCurrentHit("GlassComputerLevel2");
    }
  };

  const onPlayerExitGlassComputer = ({ other }) => {
    if (
      other.rigidBodyObject.name === "player" &&
      currentHit === "GlassComputerLevel2"
    ) {
      console.log("player is gone");
      setCurrentHit("");
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setGlassBridges([
      {
        row: 3,
        col: 8,
        position: [-8, 7, -7],
        rotation: [
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ],
        timestamp: Date.now(), // Add a unique identifier
      },
    ]);
  }, [resetTrigger]);

  useFrame(
    ({
      state,
      delta,
      clock, // clock.getElapsedTime() is the time in seconds since the clock started.
    }) => {
      const elapsedTime = clock.getElapsedTime();
      if (UFO.current) {
        // Rotate around Y-axis
        const newRotation = (elapsedTime * 90) % 360;
        setUfoRotationY(newRotation);
        UFO.current.setRotation([0, degreeNumberToRadian(newRotation), 0]);

        if (isActivateScanner) {
          if (ufoPositionX > -34) {
            setUfoPositionX((prev) => prev - 0.03);
          } else {
            setUfoPositionX(-8);
            setIsActivateScanner(false);
          }
        }
      }

      if (ePressed && currentHit === "GlassComputerLevel2") {
        const currentTime = new Date().getTime();
        if (currentTime - lastPressTime > 200) {
          console.log("TEST");
          setIsOpenGlassClassifier((prev) => !prev);
          setIsInteracting((prev) => !prev);
          setLastPressTime(currentTime);
        }
      }
    }
  );

  useEffect(() => {
    return () => {
      // Cleanup timer on unmount
      if (stopTimer) {
        clearTimeout(stopTimer);
      }
    };
  }, [stopTimer]);

  const [glowColor1, setGlowColor1] = useState("red");

  useEffect(() => {
    const interval1 = setInterval(() => {
      setGlowColor1((prevColor) => (prevColor === "red" ? "green" : "red"));
    }, 1000);

    return () => clearInterval(interval1);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} color={"lightblue"} />
      <Spike />
      {golemInScene.map((golem, index) => (
        <GolemPatrollController
          key={index}
          id={index}
          name={golem.name}
          waypoints={golem.waypoints}
          angle={golem.angle}
          idleTime={golem.idleTime}
          chaseTimeLimit={golem.chaseTimeLimit}
          patrolType={golem.patrolType}
          showPath={golem.showPath}
          data={golem.data}
          setEnemyPatrolInScene={setGolemInScene}
        />
        ))}
      {isActivateScanner && (
        <RigidBody
          name="UFO-Glass-Scanner-Real"
          type="fixed"
          colliders={false}
          lockTranslations
          lockRotations
          position={[ufoPositionX, 14, -10]}
          ref={UFO}
          scale={[50, 0.2, 50]}
        >
          <mesh scale={[0.5, 50, 0.5]} position={[0, -4, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <FakeGlowMaterial
              glowColor={glowColor1}
              falloff={2}
              glowInternalRadius={10}
              opacity={1}
            />
          </mesh>
          <CuboidCollider
            args={[0.02, 20, 0.08]}
            position={[-0.0, -7, 0.006]}
          />
          <Item
            item={{
              name: "BlueUFO",
              position: [0, 4, 0],
              scale: [0.0005, 0.2, 0.0005],
              fileType: "glb",
              rotation: [
                degreeNumberToRadian(0),
                degreeNumberToRadian(ufoRotationY), // Apply Y-axis rotation
                degreeNumberToRadian(0),
              ],
            }}
          />
        </RigidBody>
      )}
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-35, 9, -10]}
        scale={[16, 0.5, 4.5]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
          degreeNumberToRadian(0),
        ]}
      >
        <Box args={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
          <FakeGlowMaterial glowColor="gray" />
        </Box>
      </RigidBody>
      {glassBridges.map((bridge, index) => (
        <GlassBridge
          key={index}
          row={bridge.row}
          col={bridge.col}
          position={bridge.position}
          rotation={bridge.rotation}
        />
      ))}
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-10, -1.5, 10]}
        scale={[10, 12, 10]}
      >
        <Item
          item={{
            name: "LadderShort",
            position: [0.85, 0.16, -2.4],
            scale: [50, 50, 50],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-1.6, 8.7, -10.5]}
        scale={[400, 500, 300]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-1.6, 8.7, -10.5]}
        scale={[400, 500, 300]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-3.5, 8.7, -13.5]}
        scale={[350, 350, 350]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(-145),
        ]}
        onCollisionEnter={onPlayerEnterGlassComputer}
        onCollisionExit={onPlayerExitGlassComputer}
      >
        <CuboidCollider args={[0.005, 0.005, 0.01]} position={[0, 0, 0.011]} />
        <Item
          item={{
            name: "ClassifyComputer",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={2}
        />
      </RigidBody>
    </>
  );
};

export default Room1;
