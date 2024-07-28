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

const bloomColor = new Color("#ff0000");
bloomColor.multiplyScalar(1.2);

const Room1 = ({
  isOpenGlassClassifier,
  setIsOpenGlassClassifier,
  isActivateScanner,
  setIsActivateScanner,
}) => {
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
  
        if (isActivateScanner && ufoPositionX > -30) {
          setUfoPositionX((prev) => prev - 0.1);
        }

        if (isActivateScanner && ufoPositionX <= -30 && !stopTimer) {
          // Stop and start the timer
          setStopTimer(setTimeout(() => {
            setIsActivateScanner(false);
            setCurrentHit("");
            setIsInteracting(false);
            setIsUsingSecurityCamera(false);
            setStopTimer(null);
            setUfoPositionX(-8);
          }, 2000));
        }
      }
  
      if (ePressed && currentHit === "GlassComputerLevel2") {
        const currentTime = new Date().getTime();
        if (currentTime - lastPressTime > 200) {
          console.log("TEST");
          if(isActivateScanner || isOpenGlassClassifier) {
            setIsActivateScanner(false);
            setCurrentHit("");
            setIsInteracting(false);
            setIsUsingSecurityCamera(false);
            setIsOpenGlassClassifier(false);
            setUfoPositionX(-8);
          }
          else{
            setIsOpenGlassClassifier(true);
            setIsInteracting(true);
            setIsPredict(false);
            setReAlign(
              Date.now()
            );
          }
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

  return (
    <>
      <ambientLight intensity={0.5} color={"lightblue"} />
      <Spike />
      {isActivateScanner && <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[ufoPositionX, 14, -10]}
        ref={UFO}
        scale={[50, 0.2, 50]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(ufoRotationY), // Apply Y-axis rotation
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "BlueUFO",
            position: [0, 4, 0],
            scale: [0.0005, 0.2, 0.0005],
            fileType: "glb",
          }}
          opacity={0}
        />
      </RigidBody>}
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
      <GlassBridge row={3} col={8} position={[-8, 7, -7]} predict={isActivateScanner} rotation={[
        degreeNumberToRadian(0),
        degreeNumberToRadian(180),
        degreeNumberToRadian(0),
      ]} reAlign={reAlign}/>
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
