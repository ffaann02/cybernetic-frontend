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
import { useContext, useRef, useState, useEffect, createRef } from "react";
import { useFrame } from "@react-three/fiber";
import { GameContext } from "../../../../contexts/GameContext";
import { Controls } from "../../../../controllers/CharacterController";
import EnemyPatrolController from "../../../../controllers/EnemyPatrolController";
import { enemyPatrolProps } from "./EnemyDataProps";

const GLASS_NUMBER = 10;

const generateRandomPosition = (existingPositions) => {
  let position;
  let isValidPosition = false;

  while (!isValidPosition) {
    position = [
      Math.random() * 32 - 30, // Random x position between -30 and 2
      3, // Fixed y position
      Math.random() * 32 - 16, // Random z position between -16 and 16
    ];

    isValidPosition = existingPositions.every(
      (existingPosition) =>
        Math.abs(existingPosition[0] - position[0]) >= 2 &&
        Math.abs(existingPosition[2] - position[2]) >= 2
    );
  }

  return position;
};

const generateRandomState = () => {
  return Math.random() < 0.5 ? "danger" : "safe";
};

const Room2 = ({}) => {
  const [vodkaGlasses, setVodkaGlasses] = useState([]);
  const wPressed = useKeyboardControls((state) => state[Controls.forward]);
  const sPressed = useKeyboardControls((state) => state[Controls.backward]);
  const aPressed = useKeyboardControls((state) => state[Controls.left]);
  const dPressed = useKeyboardControls((state) => state[Controls.right]);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const spacePressed = useKeyboardControls((state) => state[Controls.jump]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const [physicsGlassType, setPhysicsGlassType] = useState(
    Array(GLASS_NUMBER).fill("dynamic")
  );
  const { currentHit, setCurrentHit, setIsInteracting, playerRigidBody } =
    useContext(GameContext);

  const [isLiftGlass, setIsLiftGlass] = useState(false);
  const [currentGlassId, setCurrentGlassId] = useState(-1);
  const [currentLiftGlassId, setCurrentLiftGlassId] = useState(-1);

  const vodkaRefs = useRef([]);

  const teleport1 = useRef();
  const teleport2 = useRef();

  useEffect(() => {
    const glasses = [];
    const positions = [];

    for (let i = 0; i < 10; i++) {
      const position = generateRandomPosition(positions);
      positions.push(position);
      glasses.push({
        id: i,
        position: position,
        state: generateRandomState(),
      });
    }
    setVodkaGlasses(glasses);
    vodkaRefs.current = new Array(glasses.length).fill().map(() => createRef());
  }, []);

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
      console.log("out");
      setCurrentHit("");
    }
  };

  const onPlayerEnterEachGlass =
    (glassId) =>
    ({ other }) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        const glassRef = vodkaRefs.current[glassId];
        const glassPosition = vec3(glassRef.current.translation());
        setCurrentHit(`Glass${glassId}`);
      }
    };

  const onPlayerExitEachGlass =
    (glassId) =>
    ({ other }) => {
      if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
        const glassRef = vodkaRefs.current[glassId];
        const glassPosition = vec3(glassRef.current.translation());
        setCurrentHit("");
      }
    };

  useFrame(({ clock }) => {
    const currentTime = new Date().getTime();
    if (ePressed && currentTime - lastPressTime > 200) {
      if (currentHit === "Teleport1") {
        if (teleport1.current && playerRigidBody.current) {
          const destinationPosition = vec3(teleport1.current.translation());
          playerRigidBody.current.setTranslation(destinationPosition, true);
          console.log("teleport up");
          setCurrentHit("");
        } else {
          console.error("Destination object or rigidBody ref not found");
        }
      }
      if (currentHit === "Teleport2") {
        if (teleport2.current && playerRigidBody.current) {
          const destinationPosition = vec3(teleport2.current.translation());
          playerRigidBody.current.setTranslation(destinationPosition, true);
          console.log("teleport down");
          setCurrentHit("");
        } else {
          console.error("Destination object or rigidBody ref not found");
        }
      }

      // pick glass
      if (currentHit?.includes("Glass") && !isLiftGlass) {
        const glassId = parseInt(currentHit.replace("Glass", ""));
        setIsLiftGlass(true);
        setCurrentLiftGlassId(glassId);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) => (id === glassId ? "fixed" : type))
        );
      }

      // drop glass
      if (isLiftGlass && currentHit === "") {
        setIsLiftGlass(false);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) =>
            id === currentLiftGlassId ? "dynamic" : type
          )
        );
        const glassRef = vodkaRefs.current[currentLiftGlassId];
        const playerPosition = vec3(playerRigidBody.current.translation());
        glassRef.current.setTranslation(
          {
            x: playerPosition.x,
            y: playerPosition.y,
            z: playerPosition.z + 4,
          },
          true
        );
        setCurrentLiftGlassId(-1);
      }
      setLastPressTime(currentTime);
    }

    if (isLiftGlass) {
      const glassRef = vodkaRefs.current[currentLiftGlassId];
      const glassPosition = vec3(glassRef.current.translation());
      const playerPosition = vec3(playerRigidBody.current.translation());
      glassRef.current.setTranslation(
        {
          x: playerPosition.x,
          y: playerPosition.y + 10,
          z: playerPosition.z,
        },
        true
      );
    }
  });

  return (
    <>
      {vodkaGlasses.map((glass, id) => (
        <RigidBody
          ref={vodkaRefs.current[id]}
          key={glass.id}
          type={physicsGlassType[id]}
          colliders={false}
          lockTranslations={false}
          lockRotations={true}
          position={glass.position}
          scale={[2.5, 2.5, 2.5]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(-120),
            degreeNumberToRadian(0),
          ]}
          mass={60}
          onCollisionEnter={onPlayerEnterEachGlass(glass.id)}
          onCollisionExit={onPlayerExitEachGlass(glass.id)}
        >
          <CylinderCollider args={[1, 0.85, 1]} position={[0, 0, 0]} />
          <Item
            item={{
              name: "VodkaGlass",
              position: [0, 0, 0],
              scale: [1, 1, 1],
              fileType: "glb",
            }}
            isOutlined
            outlineColor="cyan"
            outlineThickness={4}
          />
          <FakeGlowMaterial
            glowColor={glass.state === "danger" ? "red" : "green"}
            opacity={0}
          />
        </RigidBody>
      ))}

      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-36,23, 15]}
        scale={[100, 100, 100]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
          degreeNumberToRadian(90),
        ]}
      >
        <Item
          item={{
            name: "Switch",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-31,24, 10]}
        scale={[200, 200, 200]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
        ]}
      >
        <Item
          item={{
            name: "WaterTank",
            position: [0.001, 0.003, -0.002],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "PortalPad",
            position: [0, 0, -0.02],
            scale: [0.01, 0.02, 0.01],
            rotation: [
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "PipeLong",
            position: [0, 0.0142, 0.035],
            scale: [0.2, 0.2, 0.2],
            rotation: [
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "CurvePipe",
            position: [0, 0.031, 0.0348],
            scale: [0.2, 0.2, 0.2],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(-180),
              degreeNumberToRadian(-90),
            ],
            fileType: "glb",
          }}
        />
      </RigidBody>

      <RigidBody
        name="Teleport1"
        type="fixed"
        colliders={false}
        position={[0, -1, 16]}
        scale={[1, 1, 1]}
        lockRotations
        lockTranslations
        onCollisionEnter={onPlayerEnterTeleport2}
        onCollisionExit={onPlayerExitTeleport2}
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
        ref={teleport1}
        type="fixed"
        colliders={"trimesh"}
        position={[0, 0, 16]}
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
        position={[0, 19, 16]}
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
        ref={teleport2}
        type="fixed"
        colliders={"trimesh"}
        position={[0, 20, 16]}
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
        name="floor2"
        colliders={"trimesh"}
        type="fixed"
        position={[-16, 20, 0]}
        scale={[40, 10, 40]}
        lockRotations
        lockTranslations
      >
        <Box args={[1, 0.04, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="gray" transparent opacity={0.5} />
          {/* <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"cyan"}
            falloff={2}
            opacity={0.8}
            glowSharpness={0}
            side="THREE.FrontSide"
          /> */}
        </Box>
      </RigidBody>
    </>
  );
};

export default Room2;
