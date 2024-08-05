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

const bloomColor = new Color("#ff0000");
bloomColor.multiplyScalar(1.2);

const Room3 = ({
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
  const {
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
    glassParameters,
    setGlassParameters,
    isOpenTrainComputer,
    setIsOpenGlassClassifier,
    setIsOpenTrainComputer,
    isActivateScanner,
    setIsActivateScanner,
  } = useLevel2Context();

  const wPressed = useKeyboardControls((state) => state[Controls.forward]);
  const sPressed = useKeyboardControls((state) => state[Controls.backward]);
  const aPressed = useKeyboardControls((state) => state[Controls.left]);
  const dPressed = useKeyboardControls((state) => state[Controls.right]);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const spacePressed = useKeyboardControls((state) => state[Controls.jump]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const UFO = useRef();
  const [ufoRotationY, setUfoRotationY] = useState(0);
  const [ufoPositionX, setUfoPositionX] = useState(-8);
  const [stopTimer, setStopTimer] = useState(null);
  const [predict, setPredict] = useState(true);
  const [reAlign, setReAlign] = useState(false);
  const [randomizeOnReset, setRandomizeOnReset] = useState(false);
  const [currentHitComputerId, setCurrentHitComputerId] = useState(-1);
  const [glassBridge, setGlassBridge] = useState(null);

  const UFO1 = useRef();
  const UFO2 = useRef();
  const UFO3 = useRef();

  const [ufoPosition1Z, setUfoPosition1Z] = useState(0);
  const [ufoRotation1Y, setUfoRotation1Y] = useState(0);

  const [ufoPosition2Z, setUfoPosition2Z] = useState(0);
  const [ufoRotation2Y, setUfoRotation2Y] = useState(0);

  const [ufoPosition3Z, setUfoPosition3Z] = useState(0);
  const [ufoRotation3Y, setUfoRotation3Y] = useState(0);

  const toggleRandomize = () => {
    setRandomizeOnReset((prev) => !prev);
  };

  const onPlayerEnterComputer =
    (computerId) =>
    ({ other }) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        setCurrentHit("ComputerTestGlass");
        setCurrentHitComputerId(computerId);
      }
    };

  const onPlayerExitComputer =
    (computerId) =>
    ({ other }) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        setCurrentHit("");
        setCurrentHitComputerId(-1);
      }
    };

    const onPlayerEnterTrainGlassComputer = ({other}) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        setCurrentHit("ComputerGlassTrainLevel2");
      }
    }

    const onPlayerExitTrainGlassComputer = ({other}) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        setCurrentHit("");
        setCurrentHitComputerId(-1);
      }
    }

  const ufoPositionRefs = [
    useRef(ufoPosition1Z),
    useRef(ufoPosition2Z),
    useRef(ufoPosition3Z),
  ];

  useEffect(() => {
    ufoPositionRefs[0].current = ufoPosition1Z;
    ufoPositionRefs[1].current = ufoPosition2Z;
    ufoPositionRefs[2].current = ufoPosition3Z;
  }, [ufoPosition1Z, ufoPosition2Z, ufoPosition3Z]);

  useFrame(() => {
    const currentTime = new Date().getTime();

    if (ePressed && currentTime - lastPressTime > 200) {
      if (currentHit === "ComputerTestGlass") {
        setIsInteracting((prev) => !prev);
        setCurrentComputerGlassTest(currentHitComputerId);
        setIsOpenGlassTest((prev) => !prev);
      }
      if(currentHit === "ComputerGlassTrainLevel2"){
        setIsInteracting((prev) => !prev);
        setIsOpenTrainComputer((prev) => !prev);
      }
      setLastPressTime(currentTime);
    }

    // Handle UFO movement logic
    setUfoActiveList((prevList) => {
      const newList = [...prevList];
      const rotationIncrement = 10;
      const movementSpeed = 0.03;

      if (newList[0]) {
        setUfoPosition1Z((prevZ) => {
          const newZ = prevZ - movementSpeed;
          if (newZ <= -18) {
            newList[0] = false;
            return 0; // Reset position to zero
          }
          return newZ;
        });
        setUfoRotation1Y((prevY) => prevY + rotationIncrement); // Rotate around Y-axis
      }

      if (newList[1]) {
        setUfoPosition2Z((prevZ) => {
          const newZ = prevZ - movementSpeed;
          if (newZ <= -18) {
            newList[1] = false;
            return 0; // Reset position to zero
          }
          return newZ;
        });
        setUfoRotation2Y((prevY) => prevY + rotationIncrement); // Rotate around Y-axis
      }

      if (newList[2]) {
        setUfoPosition3Z((prevZ) => {
          const newZ = prevZ - movementSpeed;
          if (newZ <= -18) {
            newList[2] = false;
            return 0; // Reset position to zero
          }
          return newZ;
        });
        setUfoRotation3Y((prevY) => prevY + rotationIncrement); // Rotate around Y-axis
      }

      return newList;
    });
  });

  const [glassBridges, setGlassBridges] = useState([
    {
      position: [-22, 0, 0],
      computerPosition: [-20, 0, 3],
      index: 1,
      create_timestamp: new Date().getTime(),
    },
    {
      position: [-14, 0, 0],
      computerPosition: [-12, 0, 3],
      index: 2,
      create_timestamp: new Date().getTime(),
    },
    {
      position: [-6, 0, 0],
      computerPosition: [-4, 0, 3],
      index: 3,
      create_timestamp: new Date().getTime(),
    },
  ]);
  useEffect(() => {
    setGlassBridges([
      {
        position: [-22, 0, 0],
        computerPosition: [-20, 0, 3],
        index: 1,
        create_timestamp: new Date().getTime(),
      },
      {
        position: [-14, 0, 0],
        computerPosition: [-12, 0, 3],
        index: 2,
        create_timestamp: new Date().getTime(),
      },
      {
        position: [-6, 0, 0],
        computerPosition: [-4, 0, 3],
        index: 3,
        create_timestamp: new Date().getTime(),
      },
    ]);
  }, [resetTrigger]);

  const [glowColor1, setGlowColor1] = useState("red");
  const [glowColor2, setGlowColor2] = useState("red");
  const [glowColor3, setGlowColor3] = useState("red");

  useEffect(() => {
    const interval1 = setInterval(() => {
      setGlowColor1((prevColor) => (prevColor === "red" ? "green" : "red"));
    }, 1000);

    return () => clearInterval(interval1);
  }, []);

  useEffect(() => {
    const interval2 = setInterval(() => {
      setGlowColor2((prevColor) => (prevColor === "red" ? "green" : "red"));
    }, 1000);

    return () => clearInterval(interval2);
  }, []);

  useEffect(() => {
    const interval3 = setInterval(() => {
      setGlowColor3((prevColor) => (prevColor === "red" ? "green" : "red"));
    }, 1000);

    return () => clearInterval(interval3);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} color={"lightblue"} />

      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[0, 0, 10]}
        scale={[400, 400, 300]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
        ]}
        onCollisionEnter={onPlayerEnterTrainGlassComputer}
        onCollisionExit={onPlayerExitTrainGlassComputer}
      >
        <CuboidCollider args={[0.003, 0.004, 0.005]} position={[0, 0, 0.005]} />
        <Item
          item={{
            name: "ClassifyComputer",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={3}
        />
      </RigidBody>

      {ufoActiveList[0] === true && (
        <RigidBody
          type="fixed"
          name="UFO-Glass-Scanner1-Left"
          colliders={false}
          lockTranslations
          lockRotations
          position={[-20.5, 4, ufoPosition1Z]}
          ref={UFO1}
          scale={[30, 0.1, 30]}
          // rotation={[0, degreeNumberToRadian(0), 0]}
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
            args={[0.03, 12, 0.02]}
            position={[-0.05, -8, 0.005]}
          />
          <CuboidCollider
            args={[0.03, 12, 0.02]}
            position={[0.05, -10, 0.005]}
          />
          <Item
            item={{
              name: "BlueUFO",
              position: [0, 4, 0],
              scale: [0.0005, 0.2, 0.0005],
              fileType: "glb",
              rotation: [0, degreeNumberToRadian(ufoRotation1Y), 0],
            }}
            opacity={0}
          />
        </RigidBody>
      )}

      {ufoActiveList[1] === true && (
        <RigidBody
          type="fixed"
          name="UFO-Glass-Scanner2"
          colliders={false}
          lockTranslations
          lockRotations
          position={[-12.5, 4, ufoPosition2Z]}
          ref={UFO2}
          scale={[30, 0.1, 30]}
          // rotation={[0, degreeNumberToRadian(ufoRotation2Y), 0]}
        >
          <mesh scale={[0.5, 50, 0.5]} position={[0, -4, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <FakeGlowMaterial
              glowColor={glowColor2}
              falloff={2}
              glowInternalRadius={10}
              opacity={1}
            />
          </mesh>
          <CuboidCollider
            args={[0.03, 12, 0.02]}
            position={[-0.05, -8, 0.005]}
          />
          <CuboidCollider
            args={[0.03, 12, 0.02]}
            position={[0.05, -10, 0.005]}
          />
          <Item
            item={{
              name: "BlueUFO",
              position: [0, 4, 0],
              scale: [0.0005, 0.2, 0.0005],
              fileType: "glb",
              rotation: [0, degreeNumberToRadian(ufoRotation2Y), 0],
            }}
            opacity={0}
          />
        </RigidBody>
      )}

      {ufoActiveList[2] === true && (
        <RigidBody
          type="fixed"
          name="UFO-Glass-Scanner3"
          colliders={false}
          lockTranslations
          lockRotations
          position={[-4.5, 4, ufoPosition3Z]}
          ref={UFO3}
          scale={[30, 0.1, 30]}
        >
          <mesh scale={[0.5, 50, 0.5]} position={[0, -4, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <FakeGlowMaterial
              glowColor={glowColor3}
              falloff={2}
              glowInternalRadius={10}
              opacity={1}
            />
          </mesh>
          <CuboidCollider
            args={[0.03, 12, 0.02]}
            position={[-0.05, -8, 0.005]}
          />
          <CuboidCollider
            args={[0.03, 12, 0.02]}
            position={[0.05, -10, 0.005]}
          />
          <Item
            item={{
              name: "BlueUFO",
              position: [0, 4, 0],
              scale: [0.0005, 0.2, 0.0005],
              fileType: "glb",
              rotation: [0, degreeNumberToRadian(ufoRotation3Y), 0],
            }}
            opacity={0}
          />
        </RigidBody>
      )}
      <GlassBridge
        row={2}
        col={6}
        gap={0.5}
        position={[-30, 0, 0]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
          degreeNumberToRadian(0),
        ]}
        answer
        fixed
        dangerArray={dangerPattern}
        resetTrigger={resetTrigger}
        randomizeOnReset={randomizeOnReset}
      />
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-28, 0, 3]}
        scale={[600, 400, 400]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer(0)}
        onCollisionExit={onPlayerExitComputer(0)}
      >
        <CuboidCollider args={[0.003, 0.003, 0.005]} position={[0, 0, 0.005]} />
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={3}
        />
      </RigidBody>
      {glassBridges.map((glassBridge, index) => (
        <GlassBridge
          row={2}
          col={6}
          gap={0.5}
          position={glassBridge.position}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
          ]}
          fixed
          dangerArray={dangerPattern}
          resetTrigger={resetTrigger}
          randomizeOnReset={randomizeOnReset}
        />
      ))}
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-20, 0, 3]}
        scale={[600, 400, 400]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer(1)}
        onCollisionExit={onPlayerExitComputer(1)}
      >
        <CuboidCollider args={[0.003, 0.003, 0.005]} position={[0, 0, 0.005]} />
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={3}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-12, 0, 3]}
        scale={[600, 400, 400]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer(2)}
        onCollisionExit={onPlayerExitComputer(2)}
      >
        <CuboidCollider args={[0.003, 0.003, 0.005]} position={[0, 0, 0.005]} />
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={3}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        lockTranslations
        lockRotations
        position={[-4, 0, 3]}
        scale={[600, 400, 400]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterComputer(3)}
        onCollisionExit={onPlayerExitComputer(3)}
      >
        <CuboidCollider args={[0.003, 0.003, 0.005]} position={[0, 0, 0.005]} />
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={3}
        />
      </RigidBody>
    </>
  );
};

export default Room3;
