import {
  Environment,
  Extrude,
  OrbitControls,
  Sphere,
  Cone,
  Box,
  Cylinder,
  Ring,
  useKeyboardControls,
} from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useContext, useRef, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { degreeNumberToRadian } from "../../../utils";
import { MapTutorial } from "../map/MapTutorial";
import { Mine } from "../../shared-object/object/Mine";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";
import { useFrame } from "@react-three/fiber";
import { useTutorialContext } from "../../../contexts/SceneContext/TutorialContext";
import AssistantBotController from "../../../controllers/AssistantBotController";
import { Controls } from "../../../controllers/CharacterController";

export const SceneObject = ({ hitCheckpoints, setHitCheckpoints }) => {
  // Create arrays of refs for the RigidBodies and Spheres
  const rigidBodyRefs = useRef([useRef(), useRef(), useRef(), useRef()]);
  const sphereRefs = useRef([useRef(), useRef(), useRef(), useRef()]);
  const glowMaterialOpacity = useRef(0.8);
  const questionMarkRef = useRef();
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const [isLifting, setIsLifting] = useState(false);

  const {
    currentCamera,
    mines,
    setMines,
    setShowStar,
    currentHit,
    setCurrentHit,
    isInteracting,
    setIsInteracting,
    playerRigidBody,
  } = useContext(GameContext);

  // Define fixed positions for the four checkpoints
  const [checkpointPositions, setCheckpointPositions] = useState([
    { index: 0, position: [-35, 14, -16] },
    { index: 1, position: [0, 3, 12] },
    { index: 2, position: [-2, 15, -16] },
    { index: 3, position: [-9, 3, -12] },
  ]);

  const { toastRef, tutorialStep, setTutorialStep, isOk, setIsOk } =
    useTutorialContext();

  const liftObjectRef = useRef();

  useFrame((state) => {
    if (ePressed && currentHit === "assistant-bot") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsInteracting((prev) => !prev);
        setLastPressTime(currentTime);
        if (tutorialStep === 0) {
          console.log("Tutorial step 1 completed");
          setIsOk(false);
          setTutorialStep(1);
        }
      }
    }
    if (ePressed && currentHit === "LiftObjectTutorial") {
      console.log("Lifting object");
      const currentTime = new Date().getTime();
      if (!isLifting) {
        console.log("hello");
        setIsLifting(true);
        setLastPressTime(currentTime);
      } else {
        setIsLifting(false);
        setLastPressTime(currentTime);
      }
    }

    if (isLifting && liftObjectRef.current) {
      const playerPosition = vec3(playerRigidBody.current.position);

      liftObjectRef.current.setTranslation(
        {
          x: playerPosition.x,
          y: playerPosition.y + 6,
          z: playerPosition.z,
        },
        true
      );
    }

    const t = state.clock.getElapsedTime();
    const yOffset = Math.sin(t * 3) * 0.5; // Floating effect
    const scale = 1.5 + Math.sin(t * 2) * 0.5;
    glowMaterialOpacity.current = 0.8 + Math.sin(t * 2) * 0.2;

    rigidBodyRefs.current.forEach((ref, index) => {
      if (ref.current && checkpointPositions[index]) {
        const [x, y, z] = checkpointPositions[index].position;

        // Update the RigidBody's translation to create a floating effect
        ref.current.setTranslation({ x, y: y + yOffset, z });

        // Update sphere scale to create a pulsating effect
        sphereRefs.current[index].current.scale.set(scale, scale, scale);
      }
    });

    if (questionMarkRef.current) {
      questionMarkRef.current.position.y = yOffset;
    }
  });

  const onPlayerEnterLiftObject = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      console.log("Player entered lift object");
      setCurrentHit("LiftObjectTutorial");
    }
  };

  const onPlayerExitLiftObject = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      console.log("Player exited lift object");
      setCurrentHit("");
    }
  };

  const onPlayerEnterCheckpoint =
    (index) =>
    ({ other }) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        setCheckpointPositions((prev) => {
          // Check if the index exists in the current state
          const exists = prev.some((cp) => cp.index === index);
          if (exists) {
            setHitCheckpoints((prev) => prev + 1);
            toastRef.current.show({
              severity: "success",
              // unstyled: true,
              closable: false,
              life: 2000,
              content: (props) => (
                <div className="flex relative z-[100] rounded-lg px-2.5 py-2 gap-x-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6692/6692095.png"
                    className="w-16 h-16 bg-white rounded-xl"
                  />
                  <div className="">
                    <p className="text-2xl font-semibold text-white">
                      Data Collected!
                    </p>
                    <p className="text-lg font-semibold text-white">
                      received 1 numeric.
                    </p>
                  </div>
                </div>
              ),
            });
            setShowStar(true);
            // Hide the star icon after 1 second
            setTimeout(() => {
              setShowStar(false);
            }, 1000);
            return prev.filter((cp) => cp.index !== index);
          }
          return prev;
        });
      }
    };

  const onPlayerExitCheckpoint = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      console.log("Player exited checkpoint");
    }
  };

  return (
    <>
      <AssistantBotController spawnPosition={[-32, 0, -7]} />
      <group>
        <mesh
          ref={questionMarkRef}
          position={[0, 0, 0]}
          visible={hitCheckpoints >= 4}
        >
          <Item
            item={{
              name: "question_mark",
              position: [-30.8, 8, -3.5],
              scale: [0.4, 0.4, 0.4],
              fileType: "glb",
              rotation: [0, degreeNumberToRadian(20), 0],
              color: "orange",
            }}
            opacity={0.8}
            isOutlined
            outlineThickness={2}
            outlineColor="orange"
          />
          <Sphere args={[4]} position={[-30.8, 10, -3.5]}>
            <FakeGlowMaterial
              glowColor="yellow"
              opacity={glowMaterialOpacity.current}
              falloff={4}
              glowInternalRadius={1}
            />
          </Sphere>
        </mesh>
      </group>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={8}
        scale={10}
        castShadow
        shadow-mapSize-height={4096}
        shadow-mapSize-width={4096}
        rotation={[0, 0, 0]}
        position={[-2, 8, 3]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <RigidBody
        ref={liftObjectRef}
        type={isLifting ? "fixed" : "dynamic"}
        colliders={false}
        lockTranslations={isLifting}
        // lockRotations
        position={[-20, 12, 0]}
        scale={[300, 300, 300]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(20),
        ]}
        onCollisionEnter={onPlayerEnterLiftObject}
        onCollisionExit={onPlayerExitLiftObject}
      >
        <CuboidCollider args={[0.0057, 0.0055, 0.0058]} />
        <Item
          item={{
            name: "WeightBox",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined
          outlineThickness={4}
          outlineColor="white"
        />
      </RigidBody>
      {checkpointPositions.map((checkpoint, index) => (
        <RigidBody
          key={index}
          name={`checkpoint_${index}`}
          index={index}
          ref={rigidBodyRefs.current[index]}
          type="fixed"
          colliders={false}
          lockRotations
          lockTranslations
          position={checkpoint.position}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(45),
            degreeNumberToRadian(0),
          ]}
          scale={[0.7, 0.7, 0.7]}
          onCollisionEnter={onPlayerEnterCheckpoint(checkpoint.index)}
          onCollisionExit={onPlayerExitCheckpoint}
        >
          <Item
            item={{
              name: "Arrow",
              position: [0, 0, 0],
              fileType: "glb",
              color: "orange",
            }}
          />
          <CuboidCollider args={[1, 1, 1]} />
          <Sphere
            ref={sphereRefs.current[index]}
            args={[3]}
            position={[0, 0, 0]}
          >
            <FakeGlowMaterial
              glowColor="green"
              opacity={glowMaterialOpacity.current}
              falloff={2}
              glowInternalRadius={1}
            />
          </Sphere>
        </RigidBody>
      ))}

      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-20, -1.5, -6]}
        scale={[10, 10, 10]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-160),
          degreeNumberToRadian(0),
        ]}
      >
        <CuboidCollider
          args={[1.2, 0.02, 0.4]}
          position={[-0.8, 0.7, 0.4]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(-35),
          ]}
        />
        <Item
          item={{
            name: "Ladder-Slope",
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
        position={[-0.7, 12, -16]}
        scale={[300, 300, 400]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(20),
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

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} key={index} />
      ))}

      <MapTutorial />
      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};
