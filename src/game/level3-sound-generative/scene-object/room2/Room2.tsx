import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { Box, Cylinder, Sphere, useKeyboardControls } from "@react-three/drei";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import AudioPanel2D from "../../../../animation/AudioPanel2D";
import { GoodBot } from "../../../../GoodBot";
import { useContext, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { GameContext } from "../../../../contexts/GameContext";
import { Controls } from "../../../../controllers/CharacterController";
import EnemyPatrolController from "../../../../controllers/EnemyPatrolController";
import { enemyPatrolProps } from "./EnemyDataProps";

const Room2 = ({
  isOpenCD,
  setIsOpenCD,
  isOpenTrainComputer,
  setIsOpenTrainComputer,
}) => {
  const cdRef = useRef();
  const [rotation, setRotation] = useState(0);
  const { currentHit, setCurrentHit, setIsInteracting, playerRigidBody } =
    useContext(GameContext);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const floor2 = useRef();
  const floor1 = useRef();
  const [enemies, setEnemies] = useState([
    {
      id: 1,
      name: "Slime",
      waypoints: [[-33, 20, 4.5]],
      angle: 45,
      idleTime: 0.1,
      chaseTimeLimit: 6,
      patrolType: "turnback",
      showPath: true,
      data: {
        data_type: "enemy",
        name: "Robotic Slime - enemy",
        element: "fire",
        size: "tiny",
        color: "red",
        speed: 5,
        mass: 50,
        armor: 8,
        attack: "chase",
        energy: 150,
        pattern: "",
        weakness: "water",
        detection_range: 5,
        image_url: "/images/slime_default.png",
      },
    },
    {
      id: 2,
      name: "Slime",
      waypoints: [[-33, 20, -3.5]],
      angle: 45,
      idleTime: 2,
      chaseTimeLimit: 5,
      patrolType: "turnback",
      showPath: true,
      data: {
        data_type: "enemy",
        name: "Robotic Slime - enemy",
        element: "water",
        size: "tiny",
        color: "blue",
        speed: 8,
        mass: 50,
        armor: 8,
        attack: "chase",
        energy: 150,
        pattern: "",
        weakness: "water",
        detection_range: 5,
        image_url: "/images/slime_default.png",
      },
    },
    {
      id: 3,
      name: "Slime",
      waypoints: [[-33, 20, -10.5]],
      angle: 45,
      idleTime: 0.2,
      chaseTimeLimit: 6,
      patrolType: "turnback",
      showPath: true,
      data: {
        data_type: "enemy",
        name: "Robotic Slime - enemy",
        element: "lightning",
        size: "tiny",
        color: "yellow",
        speed: 5,
        mass: 50,
        armor: 8,
        attack: "chase",
        energy: 150,
        pattern: "",
        weakness: "water",
        detection_range: 5,
        image_url: "/images/slime_default.png",
      },
    },
  ]);

  const [speakerActiveList, setSpeakerActiveList] = useState([
    true,
    false,
    true,
  ]);
  const speaker1ref = useRef();
  const speaker2ref = useRef();
  const speaker3ref = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (cdRef.current) {
      // Rotate around Y-axis
      const newRotation = (elapsedTime * 180) % 360;
      setRotation(newRotation);
      cdRef.current.setRotation([0, degreeNumberToRadian(newRotation), 0]);
    }
    if (ePressed && currentHit === "CD") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        // setShowDialog((prev) => !prev);
        // setIsUsingSecurityCamera((prev) => !prev);
        setIsInteracting((prev) => !prev);
        setIsOpenCD((prev) => !prev);
        // setCurrentHit("");
        setLastPressTime(currentTime);
      }
    }

    if (ePressed && currentHit === "ComputerTrainAILevel3") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        // setShowDialog((prev) => !prev);
        // setIsUsingSecurityCamera((prev) => !prev);
        setIsInteracting((prev) => !prev);
        setIsOpenTrainComputer((prev) => !prev);
        // setCurrentHit("");
        setLastPressTime(currentTime);
      }
    }

    const currentTime = new Date().getTime();
    if (ePressed && currentTime - lastPressTime > 200) {
      if (currentHit === "Teleport1") {
        if (floor1.current && playerRigidBody.current) {
          const destinationPosition = vec3(floor1.current.translation());
          playerRigidBody.current.setTranslation(destinationPosition, true);
          console.log("teleport up");
          setCurrentHit("");
        } else {
          console.error("Destination object or rigidBody ref not found");
        }
      }
      if (currentHit === "Teleport2") {
        if (floor2.current && playerRigidBody.current) {
          const destinationPosition = vec3(floor2.current.translation());
          playerRigidBody.current.setTranslation(destinationPosition, true);
          console.log("teleport down");
          setCurrentHit("");
        } else {
          console.error("Destination object or rigidBody ref not found");
        }
      }
      setLastPressTime(currentTime);
    }
  });

  const onPlayerEnterCDLoot = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Teleport2");
    }
  };

  const onPlayerExitCDLoot = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  const onPlayerEnterTeleport1 = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Teleport1");
    }
  };

  const onPlayerExitTeleport1 = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  const onPlayerEnterTeleport2 = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Teleport2");
    }
  };

  const onPlayerExitTeleport2 = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  // onCollisionEnter={onPlayerEnterTrainAI}
  // onCollisionExit={onPlayerExitTrainAI}

  const onPlayerEnterTrainAI = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      // setSpeakerActiveList([true, true, true]);
      setCurrentHit("ComputerTrainAILevel3");
    }
  };

  const onPlayerExitTrainAI = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      // setSpeakerActiveList([false, false, false]);
      setCurrentHit("");
    }
  };

  return (
    <>
      {enemies.map((enemyPartrolProp, index) => (
        <EnemyPatrolController
          id={enemyPartrolProp.id}
          key={enemyPartrolProp.id}
          name={enemyPartrolProp.name}
          waypoints={enemyPartrolProp.waypoints}
          angle={enemyPartrolProp.angle}
          idleTime={enemyPartrolProp.idleTime}
          chaseTimeLimit={enemyPartrolProp.chaseTimeLimit}
          patrolType={enemyPartrolProp.patrolType}
          showPath={enemyPartrolProp.showPath}
          data={enemyPartrolProp.data}
          setEnemyPatrolInScene={setEnemies}
          showLight={false}
          isPlayingSound={speakerActiveList[index]}
          speakerRef={
            index === 0 ? speaker1ref : index === 1 ? speaker2ref : speaker3ref
          }
        />
      ))}

      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-10, 20, -12]}
        scale={[12, 8, 14]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(90),
        ]}
      >
        <Item
          item={{
            name: "SuperComputer",
            position: [0, 0, 0],
            scale: [0.000001, 0.000001, 0.000001],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "SuperComputer",
            position: [0, 1, 0],
            scale: [0.000001, 0.000001, 0.000001],
            fileType: "glb",
          }}
          // isOutlined
          // outlineColor="white"
          // outlineThickness={2}
        />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[-16, 20, 6.5]}
        scale={[700, 700, 500]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-390),
        ]}
        onCollisionEnter={onPlayerEnterTrainAI}
        onCollisionExit={onPlayerExitTrainAI}
      >
        <Item
          item={{
            name: "ComputerVideo",
            position: [0, 0, 0],
            scale: [0.75, 0.75, 0.75],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={2}
        />
        <CuboidCollider args={[0.002, 0.002, 0.003]} position={[0, 0, 0.004]} />
      </RigidBody>

      <RigidBody
        ref={speaker3ref}
        type="fixed"
        colliders={"trimesh"}
        position={[-21, 20, -10.5]}
        scale={[800, 800, 800]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-70),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [0.75, 0.75, 0.75],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-29, 20.5, -10.5]}
        scale={[10, 10, 10]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, 0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, -0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
      </RigidBody>
      <RigidBody
        ref={speaker2ref}
        type="fixed"
        colliders={"trimesh"}
        position={[-21, 20, -3.5]}
        scale={[800, 800, 800]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-70),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [0.75, 0.75, 0.75],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-29, 20.5, -3.5]}
        scale={[10, 10, 10]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, 0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, -0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
      </RigidBody>
      <RigidBody
        ref={speaker1ref}
        type="fixed"
        colliders={"trimesh"}
        position={[-21, 20, 3.5]}
        scale={[800, 800, 800]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-70),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [0.75, 0.75, 0.75],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-29, 20.5, 4]}
        scale={[10, 10, 10]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, 0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
        <Box
          args={[1.5, 0.04, 0.05]}
          position={[0, 0, -0.2]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="red" transparent opacity={0.9} />
        </Box>
      </RigidBody>

      <RigidBody
        ref={floor2}
        lockTranslations
        lockRotations
        position={[-30, 19, 16]}
      ></RigidBody>
      <RigidBody
        ref={floor1}
        lockTranslations
        lockRotations
        position={[0, 2, 8]}
      ></RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-16.5, 20, 0]}
        scale={[40, 0.2, 38]}
        lockRotations
        lockTranslations
      >
        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <FakeGlowMaterial
            // glowInternalRadius={4}
            glowColor={"#6495ED"}
            falloff={2}
            opacity={1}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#6495ED" transparent opacity={0.05} />
        </Box>
      </RigidBody>
      <RigidBody
        name="Teleport2"
        type="fixed"
        colliders={false}
        position={[-30, 19, 16]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        onCollisionEnter={onPlayerEnterTeleport1}
        onCollisionExit={onPlayerExitTeleport1}
      >
        <CuboidCollider args={[1, 0.04, 1]} position={[0, 2, 0]} />
        <Cylinder args={[2, 2, 5, 32]} position={[0, 4.5, 0]}>
          <meshStandardMaterial color="green" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"green"}
            falloff={2}
            opacity={0.8}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Cylinder>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-30, 20, 16]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="green"
          outlineThickness={3}
        />
      </RigidBody>
      <RigidBody
        name="Teleport1"
        type="fixed"
        colliders={false}
        position={[0, -0.2, 8]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        onCollisionEnter={onPlayerEnterTeleport2}
        onCollisionExit={onPlayerExitTeleport2}
      >
        <CuboidCollider args={[1, 0.04, 1]} position={[0, 1.5, 0]} />
        <Cylinder args={[2, 2, 6, 32]} position={[0, 4, 0]}>
          <meshStandardMaterial color="green" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"green"}
            falloff={2}
            opacity={0.8}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Cylinder>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[0, -0.2, 8]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="green"
          outlineThickness={3}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[0, 0, 0]}
        lockRotations
        lockTranslations
      >
        <Item
          item={{
            name: "WallCornerDiagonal",
            position: [-16, 0, -15],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(135),
              degreeNumberToRadian(0),
            ],
            scale: [6, 0.8, 6],
            fileType: "glb",
          }}
        />
        <Box
          args={[8.2, 0.2, 4]}
          position={[-16, 4, -19]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
        </Box>
        <Box
          args={[6, 0.2, 4]}
          position={[-22.3, 4, -16.7]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(-45),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
        </Box>
        <Box
          args={[6, 0.2, 4]}
          position={[-9.7, 4, -16.7]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(45),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
        </Box>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-16, 0, -17]}
        scale={[0.1, 0.1, 0.1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-27.5, 0.8, -14]}
        scale={[10, 10, 10]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "FloorMonitor",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-4.5, 0.8, -13.5]}
        scale={[10, 10, 10]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-135),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "FloorMonitor",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-16, 8, -22]}
        scale={[0.05, 0.075, 0.06]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(-60),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
        ]}
      >
        <Item
          item={{
            name: "Monitor-Audio",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
        <Sphere
          visible={true}
          // ref={speakerGlow}
          args={[600, 1000, 20]} // args=[radius, widthSegments, heightSegments]
          position={[20, 0, 100]}
        >
          <meshStandardMaterial
            attach="material"
            color={"gray"}
            transparent
            opacity={1}
          />
          <FakeGlowMaterial
            glowInternalRadius={20}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.4}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Sphere>
      </RigidBody>
      <RigidBody
        colliders={"trimesh"}
        position={[-16, 9, -17]}
        scale={[1, 1, 2]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <AudioPanel2D />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-25, 10, -19]}
        scale={[700, 800, 700]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(20),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-7, 10, -19]}
        scale={[700, 800, 700]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(20),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Speaker",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-7, 10, -19]}
        scale={[0.1, 0.1, 0.1]}
        lockRotations
        lockTranslations
      >
        <Item
          item={{
            name: "MacDisplay",
            position: [-6, -76, 140],
            scale: [0.8, 0.8, 0.5],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(30),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "Table",
            position: [0, -100, 140],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(45),
              degreeNumberToRadian(0),
            ],
            scale: [40, 25, 40],
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[0, 1.7, -4]}
        scale={[700, 700, 700]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(80),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Shelf",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(30),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-4, 0, -6]}
        scale={[1.5, 1.5, 1.5]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-30),
          degreeNumberToRadian(0),
        ]}
      >
        <CuboidCollider args={[0.7, 1.3, 1]} position={[0, 1.8, 1]} />
        <GoodBot animation_index={3} />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-26, 1, 2.5]}
        scale={[500, 500, 500]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-30),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterCDLoot}
        onCollisionExit={onPlayerExitCDLoot}
      >
        <CuboidCollider
          args={[0.0021, 0.0035, 0.0021]}
          position={[0, 0.002, 0]}
        />
        <Item
          item={{
            name: "ScifiLoot",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="green"
          outlineThickness={3}
        />
      </RigidBody>
      <RigidBody
        ref={cdRef}
        name="CD"
        type="fixed"
        colliders={"trimesh"}
        position={[-26, 3.5, 2.5]}
        scale={[0.2, 0.2, 0.2]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(rotation),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "CD",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="white"
          outlineThickness={1}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[0, 1.7, -4]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Box
          args={[16, 0.1, 10]}
          position={[-32, 4, -5]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(90),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.3}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
        <Box
          args={[8, 0.1, 10]}
          position={[-29.1, 4, 6]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(45),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.3}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
        <Box
          args={[16, 0.1, 10]}
          position={[-18.22, 4, 8.8]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.3}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
        <Box
          args={[5.12, 0.1, 3]}
          position={[-7.66, 7.5, 8.8]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.3}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
        <Box
          args={[9, 0.1, 10]}
          position={[-0.6, 4, 8.8]}
          rotation={[
            degreeNumberToRadian(90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        >
          <meshStandardMaterial color="#6495ED" transparent opacity={0.4} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.3}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
      </RigidBody>
    </>
  );
};
export default Room2;
