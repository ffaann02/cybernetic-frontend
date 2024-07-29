import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import {
  Box,
  Cylinder,
  Outlines,
  Sphere,
  useKeyboardControls,
} from "@react-three/drei";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import AudioPanel2D from "../../../../animation/AudioPanel2D";
import { GoodBot } from "../../../../GoodBot";
import { useContext, useRef, useState, useEffect, createRef } from "react";
import { useFrame } from "@react-three/fiber";
import { GameContext } from "../../../../contexts/GameContext";
import { Controls } from "../../../../controllers/CharacterController";
import EnemyPatrolController from "../../../../controllers/EnemyPatrolController";
import { enemyPatrolProps } from "./EnemyDataProps";
import WaterDrop from "./WaterDrop";

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

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

const generateGlassParameters = (state) => {
  if (state === "danger") {
    const data = {
      name: "glass",
      type: "danger",
      color: "red",
      thickness: getRandomValue(1, 5), // Thin glass
      transparency: getRandomValue(0.5, 1), // Fairly transparent
      density: getRandomValue(0.5, 1.5), // Low density
      weight: getRandomValue(1, 5), // Low weight
      defect: true,
      breakable: true,
    };
    console.log(data);
    return data;
  } else {
    return {
      name: "glass",
      type: "safe",
      color: "green",
      thickness: getRandomValue(10, 20), // Thick glass
      transparency: getRandomValue(0.1, 0.5), // Less transparent
      density: getRandomValue(2.5, 5), // High density
      weight: getRandomValue(5, 10), // High weight
      defect: false,
      breakable: false,
    };
  }
};

const Room2 = ({ dataCollectNotify }) => {
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
  const {
    currentHit,
    setCurrentHit,
    setIsInteracting,
    playerRigidBody,
    isCarryingObject,
    setIsCarryingObject,
  } = useContext(GameContext);

  const [isLiftGlass, setIsLiftGlass] = useState(false);
  const [currentGlassId, setCurrentGlassId] = useState(-1);
  const [currentLiftGlassId, setCurrentLiftGlassId] = useState(-1);
  const [glassParameters, setGlassParameters] = useState([]);
  const [checkedWaterGlass, setCheckedWaterGlass] = useState([]);
  const [checkedWeightGlass, setCheckedWeightGlass] = useState([]);
  const [checkedPressureGlass, setCheckedPressureGlass] = useState([]);

  const vodkaRefs = useRef([]);
  const WaterPlatform = useRef();
  const LaserPlatform = useRef();
  const PressurePlatform = useRef();

  const teleport1 = useRef();
  const teleport2 = useRef();
  const WaterReleasePoint = useRef();
  const WeightMeterPoint = useRef();
  const PressureTestPoint = useRef();
  const [currentWaterFillGlassId, setCurrentWaterFillGlassId] = useState(-1);
  const [currentPressureTestGlassId, setCurrentPressureTestGlassId] =
    useState(-1);
  const [currentWeightGlassId, setCurrentWeightGlassId] = useState(-1);
  const PressurePadTop = useRef();
  const pressurePadPosition = useRef({ y: 31 });

  useEffect(() => {
    const glasses = [];
    const positions = [];
    const parameters = [];

    for (let i = 0; i < 10; i++) {
      const position = generateRandomPosition(positions);
      positions.push(position);

      const state = Math.random() < 0.5 ? "danger" : "safe";
      const params = generateGlassParameters(state);

      glasses.push({
        id: i,
        position: position,
        ...params,
      });
      parameters.push(params);
    }
    setVodkaGlasses(glasses);
    setGlassParameters(parameters);

    // Ensure vodkaRefs has the correct length and ref objects
    if (vodkaRefs.current.length !== glasses.length) {
      vodkaRefs.current = glasses.map(
        (_, index) => vodkaRefs.current[index] || createRef()
      );
    }
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
        if (isGlassChecked(glassId)) {
          setCurrentHit(`RevealGlass${glassId}`);
        } else {
          setCurrentHit(`Glass${glassId}`);
        }
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

  const isLiftGlassRef = useRef(isLiftGlass);
  const isCarryingObjectRef = useRef(isCarryingObject);
  const [isWaterTankActive, setIsWaterTankActive] = useState(false);
  const [isWeightMeterActive, setIsWeightMeterActive] = useState(false);
  const [isPressureTestActive, setIsPressureTestActive] = useState(false);
  // const [isWaterTankActive, setIsWaterTankActive] = useState(true);
  const addIfNotExist = (arr, id) => {
    if (!arr.includes(id)) {
      return [...arr, id];
    }
    return arr;
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

      if (currentHit?.includes("RevealGlass")) {
        isCarryingObjectRef.current = true;
        const glassId = parseInt(currentHit.replace("RevealGlass", ""));
        console.log(glassId);

        const glassType = glassParameters[glassId]?.type;

        dataCollectNotify.current.show({
          // unstyled: true,
          severity: "success",
          closable: false,
          life: 2000,
          content: (props) => (
            <div className="flex relative z-[100] rounded-lg px-2.5 py-2 gap-x-2">
              <div className={`w-16 h-16 rounded-xl relative`}>
                <div
                  className={`absolute w-[95%] h-full opacity-30 rounded-xl ${
                    glassType === "safe" ? "bg-green-500" : "bg-red-500"
                  }
              }`}
                ></div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/896/896123.png"
                  className=""
                />
              </div>
              <div className="">
                <p className="text-2xl font-semibold text-slate-600">
                  Data Collected!
                </p>
                <p className="text-lg font-semibold text-slate-600">
                  received 1 {glassType} glass data.
                </p>
              </div>
            </div>
          ),
        });
        // console.log(glassId);
        setVodkaGlasses((prev) => prev.filter((glass) => glass.id !== glassId));
        setCurrentHit("");

      }

      // pick glass
      if (
        currentHit?.includes("Glass") &&
        !isLiftGlass &&
        !currentHit?.includes(`RevealGlass`)
      ) {
        setIsCarryingObject(true);
        isCarryingObjectRef.current = true;
        const glassId = parseInt(currentHit.replace("Glass", ""));
        console.log(glassId, currentWaterFillGlassId);
        if (glassId === currentWaterFillGlassId) {
          setCurrentWaterFillGlassId(-1);
          setIsWaterTankActive(false);
        }
        if (glassId === currentWeightGlassId) {
          setCurrentWeightGlassId(-1);
          setIsWeightMeterActive(false);
        }
        if (glassId === currentPressureTestGlassId) {
          setCurrentPressureTestGlassId(-1);
          setIsPressureTestActive(false);
        }
        setIsLiftGlass(true);
        isLiftGlassRef.current = true;
        setCurrentLiftGlassId(glassId);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) => (id === glassId ? "fixed" : type))
        );
      }

      // drop glass
      if (isLiftGlass && (currentHit === "" || currentHit?.includes("Glass"))) {
        setIsCarryingObject(false);
        isCarryingObjectRef.current = false;
        setIsLiftGlass(false);
        isLiftGlassRef.current = false;
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
            y: playerPosition.y + 6,
            z: playerPosition.z - 4,
          },
          true
        );
        setCurrentLiftGlassId(-1);
        setCurrentHit("");
      } else if (isLiftGlass && currentHit === "WaterPlatform") {
        const playerPosition = vec3(playerRigidBody.current.translation());
        const glassRef = vodkaRefs.current[currentLiftGlassId];
        const waterPadPosition = vec3(WaterPlatform.current.translation());
        console.log(currentLiftGlassId);
        setCurrentWaterFillGlassId(currentLiftGlassId);
        setCurrentLiftGlassId(-1);

        // Immediately update ref values
        isLiftGlassRef.current = false;
        isCarryingObjectRef.current = false;

        setIsCarryingObject(false);
        setIsLiftGlass(false);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) =>
            id === currentLiftGlassId ? "dynamic" : type
          )
        );
        setIsWaterTankActive(true);
        glassRef.current.setTranslation({
          x: waterPadPosition.x,
          y: 21,
          z: waterPadPosition.z,
        });

        playerRigidBody.current.setTranslation(
          {
            x: waterPadPosition.x + 5,
            y: 21,
            z: playerPosition.z,
          },
          true
        );

        // Append to checkedWaterGlass
        setCheckedWaterGlass((prev) => addIfNotExist(prev, currentLiftGlassId));

        setCurrentLiftGlassId(-1);
      } else if (isLiftGlass && currentHit === "WeightMeter") {
        const playerPosition = vec3(playerRigidBody.current.translation());
        const glassRef = vodkaRefs.current[currentLiftGlassId];
        const waterPadPosition = vec3(WeightMeterPoint.current.translation());
        setCurrentWeightGlassId(currentLiftGlassId);
        // Immediately update ref values
        isLiftGlassRef.current = false;
        isCarryingObjectRef.current = false;
        setIsWeightMeterActive(true);

        setIsCarryingObject(false);
        setIsLiftGlass(false);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) =>
            id === currentLiftGlassId ? "dynamic" : type
          )
        );
        // setIsWaterTankActive(true);
        glassRef.current.setTranslation({
          x: waterPadPosition.x + 0.3,
          y: 23,
          z: waterPadPosition.z + 0.5,
        });

        playerRigidBody.current.setTranslation(
          {
            x: waterPadPosition.x + 5,
            y: 21,
            z: playerPosition.z,
          },
          true
        );

        // Append to checkedWeightGlass
        setCheckedWeightGlass((prev) =>
          addIfNotExist(prev, currentLiftGlassId)
        );

        setCurrentLiftGlassId(-1);
      } else if (isLiftGlass && currentHit === "PressureTest") {
        const playerPosition = vec3(playerRigidBody.current.translation());
        const glassRef = vodkaRefs.current[currentLiftGlassId];
        const waterPadPosition = vec3(PressureTestPoint.current.translation());

        setCurrentPressureTestGlassId(currentLiftGlassId);
        setCurrentLiftGlassId(-1);
        // Immediately update ref values
        isLiftGlassRef.current = false;
        isCarryingObjectRef.current = false;

        setIsPressureTestActive(true);

        setIsCarryingObject(false);
        setIsLiftGlass(false);
        setPhysicsGlassType(
          physicsGlassType.map((type, id) =>
            id === currentLiftGlassId ? "dynamic" : type
          )
        );
        // setIsWaterTankActive(true);
        glassRef.current.setTranslation({
          x: waterPadPosition.x + 0.5,
          y: 23,
          z: waterPadPosition.z + 0.3,
        });

        playerRigidBody.current.setTranslation(
          {
            x: waterPadPosition.x + 5,
            y: 21,
            z: playerPosition.z,
          },
          true
        );

        // Append to checkedPressureGlass
        setCheckedPressureGlass((prev) =>
          addIfNotExist(prev, currentLiftGlassId)
        );
      }
      setLastPressTime(currentTime);
    }
  }, -2);

  const [waterDrops, setWaterDrops] = useState([]);
  const lastDropTime = useRef(0);

  // useEffect(() => {
  //   if (waterDrops.length > 100) {
  //     setWaterDrops((prevDrops) => prevDrops.slice(-100));
  //   }
  // }, [waterDrops]);

  useFrame(({ clock }) => {
    // Use the ref values instead of state
    if (isLiftGlassRef.current) {
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
    if (isWaterTankActive) {
      const currentTime = Date.now();
      if (currentTime - lastDropTime.current >= 300) {
        // 1000ms = 1 second
        const waterReleasePosition = vec3(
          WaterReleasePoint.current.translation()
        );

        // Add a new water drop with a random offset
        const randomOffset = {
          x: Math.random() * 0.5 - 0.25,
          y: 0,
          z: Math.random() * 0.5 - 0.25,
        };

        const dropPosition = [
          waterReleasePosition.x + randomOffset.x,
          waterReleasePosition.y,
          waterReleasePosition.z + randomOffset.z,
        ];

        setWaterDrops((prevDrops) => [
          ...prevDrops,
          { id: currentTime, position: dropPosition },
        ]);

        lastDropTime.current = currentTime;
      }
    }
    if (isPressureTestActive && PressurePadTop.current) {
      // Gradually move the PressurePad down
      const currentPos = vec3(PressurePadTop.current.translation());
      if (currentPos.y > 27.5) {
        const newY = currentPos.y - 0.1; // Adjust this value to control the speed of the movement
        pressurePadPosition.current = { ...currentPos, y: newY };
        PressurePadTop.current.setTranslation(
          { x: currentPos.x, y: newY, z: currentPos.z },
          true
        );
      }
    }
    if (!isPressureTestActive && PressurePadTop.current) {
      // Gradually move the PressurePad down
      const currentPos = vec3(PressurePadTop.current.translation());
      if (currentPos.y < 31) {
        const newY = currentPos.y + 0.1; // Adjust this value to control the speed of the movement
        pressurePadPosition.current = { ...currentPos, y: newY };
        PressurePadTop.current.setTranslation(
          { x: currentPos.x, y: newY, z: currentPos.z },
          true
        );
      }
    }
  }, -1);

  const onPlayerEnterWaterPlatform = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("WaterPlatform");
      console.log("can place glass here");
    }
  };

  const onPlayerExitWaterPlatform = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
      // console.log("can place glass here");
    }
  };

  const onPlayerEnterWeightMeter = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("WeightMeter");
      console.log("can place glass here to weight");
    }
  };

  const onPlayerExitWeightMeter = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
      // console.log("can place glass here");
    }
  };

  const onPlayerEnterPressureTest = ({ other }) => {
    console.log("in");
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("PressureTest");
      console.log("can place glass here to pressure test");
    }
  };

  const onPlayerExitPressureTest = ({ other }) => {
    console.log("out");
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
      // console.log("can place glass here");
    }
  };

  const isGlassChecked = (id) => {
    return (
      checkedWaterGlass.includes(id) &&
      checkedWeightGlass.includes(id) &&
      checkedPressureGlass.includes(id)
    );
  };

  return (
    <>
      {vodkaGlasses.map((glass, id) => (
        <RigidBody
          ref={vodkaRefs.current[glass.id]}
          name={`Glass${id}`}
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
          {physicsGlassType[glass.id] === "dynamic" && (
            <CylinderCollider args={[1, 0.85, 1]} position={[0, 0, 0]} />
          )}
          <Item
            item={{
              name: "VodkaGlass",
              position: [0, 0, 0],
              scale: [1, 1, 1],
              fileType: "glb",
            }}
            isOutlined
            outlineColor={
              glassParameters.length > 0 && isGlassChecked(glass.id)
                ? glassParameters[glass.id]?.color
                : "cyan" // Set a default color if not checked
            }
            outlineThickness={2}
          />
          <FakeGlowMaterial
            glowColor={glass.state === "danger" ? "red" : "green"}
            opacity={0}
          />
        </RigidBody>
      ))}

      {waterDrops.map((drop) => (
        <WaterDrop
          key={drop.id}
          position={drop.position}
          setWaterDrops={setWaterDrops}
        />
      ))}

      <RigidBody
        type="fixed"
        ref={WaterReleasePoint}
        colliders={false}
        position={[-23.4, 29, 10]}
        scale={[200, 200, 200]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-90),
        ]}
      ></RigidBody>
      <RigidBody
        type="fixed"
        ref={PressurePadTop}
        colliders={false}
        position={[-16, 31, -17]}
        scale={[2.5, 0.5, 2.5]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        // onCollisionEnter={onPlayerEnterPressureTest}
        // onCollisionExit={onPlayerExitPressureTest}
      >
        <CylinderCollider args={[0.5, 7, 1]} position={[0, 2, 0]} />
        <Item
          item={{
            name: "PressurePad",
            position: [0.001, 0.003, -0.002],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isPressureTestActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
        <Item
          item={{
            name: "CurvePipe",
            position: [0, 8, 0],
            scale: [50, 20, 20],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(-180),
              degreeNumberToRadian(-90),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isPressureTestActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
      </RigidBody>
      <RigidBody
        ref={PressureTestPoint}
        type="fixed"
        colliders={false}
        position={[-16, 19, -15]}
        scale={[300, 300, 300]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterPressureTest}
        onCollisionExit={onPlayerExitPressureTest}
      >
        <CylinderCollider args={[0.0025, 0.012, 1]} position={[0, 0.007, 0]} />
        <Item
          item={{
            name: "LandingPad",
            position: [0.001, 0.003, -0.002],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isPressureTestActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
      </RigidBody>

      <RigidBody
        ref={WeightMeterPoint}
        type="fixed"
        colliders={false}
        position={[-31, 20.5, -8]}
        scale={[0.1, 0.1, 0.1]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterWeightMeter}
        onCollisionExit={onPlayerExitWeightMeter}
      >
        <CylinderCollider args={[8, 36, 1]} position={[4, 7, 0]} />
        <Item
          item={{
            name: "WeightMeter",
            position: [0.001, 0.003, -0.002],
            scale: [1, 1, 1],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isWeightMeterActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-31, 24, 10]}
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
          isOutlined
          outlineColor={isWaterTankActive ? "orange" : "lightgreen"}
          outlineThickness={4}
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
          isOutlined
          outlineColor={isWaterTankActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
        <Item
          item={{
            name: "PipeLong",
            position: [0, 0.02, 0.035],
            scale: [0.2, 0.2, 0.2],
            rotation: [
              degreeNumberToRadian(90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isWaterTankActive ? "orange" : "lightgreen"}
          outlineThickness={4}
        />
        <Item
          item={{
            name: "CurvePipe",
            position: [0, 0.0368, 0.0348],
            scale: [0.2, 0.2, 0.2],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(-180),
              degreeNumberToRadian(-90),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor={isWaterTankActive ? "orange" : "lightgreen"}
          outlineThickness={4}
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
        name="water-platform"
        ref={WaterPlatform}
        colliders={false}
        type="fixed"
        position={[-23, 21, 10]}
        scale={[5, 10, 5]}
        lockRotations
        lockTranslations
        onCollisionEnter={onPlayerEnterWaterPlatform}
        onCollisionExit={onPlayerExitWaterPlatform}
      >
        <CuboidCollider args={[0.55, 0.04, 0.55]} position={[0, -0.05, 0]} />
        <Box args={[1, 0.04, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="gray" transparent opacity={0.5} />
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"lightgreen"}
            falloff={2}
            opacity={0.8}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
          {/* <Outlines
            thickness={1}
            color={"green"}
            angle={180}
            screenspace={true}
          /> */}
        </Box>
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
          <FakeGlowMaterial
            glowInternalRadius={0.1}
            glowColor={"gray"}
            falloff={2}
            opacity={0.8}
            glowSharpness={0}
            side="THREE.FrontSide"
          />
        </Box>
      </RigidBody>
    </>
  );
};

export default Room2;
