import { useState, useEffect, useRef, useContext } from "react";
import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { Box,useKeyboardControls } from "@react-three/drei";
import CountdownComputer from "../room2/CountdownComputer";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import { useFrame } from "@react-three/fiber";
import { GameContext } from "../../../../contexts/GameContext";
import { GoodBot } from "../../../../GoodBot";
import { Controls } from "../../../../controllers/CharacterController";
import LaserTargetObject, { LaserTargetObjectProps } from "../room2/LaserTargetObject";
import { useLevel1Context } from "../../../../contexts/SceneContext/Level1Context";

const Room2 = ({
  totalWeight,
  setTotalWeight,
  allowCraneUp,
  setAllowCraneUp,
  setObjectCollectedList,
  setNumericalCollectedList,
  dataCollectNotify,
}) => {
  const [laserColor, setLaserColor] = useState("red"); // Initial color is red
  const [countdownOpacities, setCountdownOpacities] = useState([
    0.9, 0.9, 0.9, 0.9, 0.9,
  ]); // Initial opacities
  const {
    objectData,
    setObjectData,
    dropedObject,
    setDropedObject,
    currentLaserTarget,
    setCurrentLaserTarget,
  } = useLevel1Context();

  const cameraRef = useRef();

  useEffect(() => {
    const laserInterval = setInterval(() => {
      setLaserColor((prevColor) => {
        const newColor = prevColor === "red" ? "green" : "red";
        setCountdownOpacities([0.9, 0.9, 0.9, 0.9, 0.9]); // Reset countdown opacities when color changes
        return newColor;
      });
    }, 5000); // Toggle color every 5 seconds

    return () => clearInterval(laserInterval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdownOpacities((prevOpacities) => {
        const newOpacities = [...prevOpacities];
        const index = newOpacities.findIndex((opacity) => opacity === 0.9);
        if (index !== -1) {
          newOpacities[index] = 0;
        }
        return newOpacities;
      });
    }, 1000); // Decrease opacity every second

    return () => clearInterval(countdownInterval); // Clean up on component unmount
  }, []);

  const aPressed = useKeyboardControls((state) => state[Controls.left]);
  const dPressed = useKeyboardControls((state) => state[Controls.right]);
  const spacePressed = useKeyboardControls((state) => state[Controls.jump]);
  const gPressed = useKeyboardControls((state) => state[Controls.G]);

  const [lastPressTime, setLastPressTime] = useState(0);

  // Dynamically set the name based on the laser's color
  const laserName = laserColor === "red" ? "danger-laser" : "safe-laser";
  const [weightRockList, setWeightRockList] = useState([
    {
      name: "WeightRock1",
      position: [-10, 4, 0],
      rotation: 0,
      fileType: "glb",
      scale: [10, 10, 10],
      weight: 24,
    },
    {
      name: "WeightRock2",
      position: [-16, 4.65, 2],
      rotation: 0,
      fileType: "glb",
      scale: [3, 3, 3],
      weight: 17,
    },
    {
      name: "WeightRock3",
      position: [-12, 4.65, 10],
      rotation: 0,
      fileType: "glb",
      scale: [3, 3, 3],
      weight: 22,
    },
    {
      name: "WeightRock4",
      position: [-10, 4.65, 5],
      rotation: 0,
      fileType: "glb",
      scale: [3, 3, 3],
      weight: 18,
    },
    {
      name: "WeightRock5",
      position: [-4, 4.65, 14],
      rotation: 0,
      fileType: "glb",
      scale: [3, 3, 3],
      weight: 10,
    },
  ]);

  const { currentHit, setCurrentHit } = useContext(GameContext);

  const [currentPlatformCarrying, setCurrentPlatformCarrying] = useState([]);
  const [playerIsOnCrane, setPlayerIsOnCrane] = useState(false);

  const handleCollisionEnter = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name.includes("WeightRock")) {
        const weightRock = weightRockList.find((rock) => rock.name === name);
        if (weightRock) {
          setCurrentPlatformCarrying((prev) => {
            if (!prev.some((rock) => rock.name === name)) {
              return [...prev, weightRock];
            }
            return prev;
          });
        }
      }
      if (name === "player" && !playerIsOnCrane) {
        setPlayerIsOnCrane(true);
        setCurrentPlatformCarrying((prev) => [
          ...prev,
          { name: "player", weight: 10 },
        ]);
      }
      if (name.includes("enemy")) {
        console.log("enemy enter: ", name);
        setCurrentPlatformCarrying((prev) => [...prev, { name, weight: 16 }]);
      }
    }
  };

  const handleCollisionExit = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name.includes("WeightRock")) {
        setCurrentPlatformCarrying((prev) =>
          prev.filter((rock) => rock.name !== name)
        );
      }
      if (name === "player" && playerIsOnCrane) {
        setPlayerIsOnCrane(false);
        setCurrentPlatformCarrying((prev) =>
          prev.filter((rock) => rock.name !== "player")
        );
      }
      if (name.includes("enemy")) {
        setCurrentPlatformCarrying((prev) =>
          prev.filter((rock) => rock.name !== name)
        );
      }
    }
  };

  const handlePlayerEnterComputer = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("Level1-Crane-Computer");
      }
    }
  };
  const handlePlayerLeaveComputer = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("");
      }
    }
  };

  const handleCollisionSecurityEnter = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("Computer-camera-01");
      }
    }
  };
  const handleCollisionSecurityExit = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("");
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(currentPlatformCarrying)) {
      const totalWeight = currentPlatformCarrying.reduce(
        (sum, rock) => sum + rock.weight,
        0
      );
      setTotalWeight(totalWeight);
    }
  }, [currentPlatformCarrying]);

  const craneRef = useRef();
  const LootBox01Ref = useRef();
  const LootBox01CraneRef = useRef();


  useFrame((state, delta) => {

    if (currentHit?.includes("Computer-camera-01-trigger") && currentLaserTarget !== "") {
      if (gPressed) {
        const distance = currentHit.split(":")[1];
        console.log("get data: ", distance);
        setNumericalCollectedList((prevList) => {
          const duplicate = prevList.find((data) => data.name === currentLaserTarget);
          if (duplicate) {
            return prevList;
          }
          else {
            const data = {
              name: currentLaserTarget,
              value: distance,
            };
            return [...prevList, data];
          }
        });
        const currentTime = new Date().getTime();
        if (currentTime - lastPressTime > 200) {
          setLastPressTime(currentTime);
          dataCollectNotify.current.show({
            unstyled: true,
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
        }
      }
      else if (spacePressed) {
        console.log("drop: ", currentLaserTarget);
        setDropedObject((prev) => {
          const dropedObject = objectData.find((object) => object.item.name === currentLaserTarget);
          if (dropedObject) {
            return [...prev, dropedObject];
          }
          return prev;
        })
        setObjectData(objectData.filter((object) => object.item.name !== currentLaserTarget));
        setCurrentHit("Computer-camera-01");
      }
    }

    if (cameraRef.current) {
      const t = state.clock.getElapsedTime();
      const yOffset = Math.sin(t * 3) * 0.3; // Floating effect

      // Update the RigidBody's translation
      cameraRef.current.setTranslation({
        x: -8.2,
        y: 4.25 + yOffset,
        z: -15.7,
      });
    }

    if (cameraRef.current) {
      const t = state.clock.getElapsedTime();
      const yOffset = Math.sin(t * 3) * 0.3; // Floating effect

      // Update the RigidBody's translation
      cameraRef.current.setTranslation({
        x: -8.2,
        y: 4.25 + yOffset,
        z: -15.7,
      });
    }
    if (craneRef.current) {
      const currentPosition = vec3(craneRef.current.translation());

      const liftPerFrame = 0.08;
      const TopReachPoint = 10;
      const bottomReachPoint = 0.1;
      if (allowCraneUp && currentPosition.y < TopReachPoint) {
        craneRef.current.setTranslation({
          x: currentPosition.x,
          y: Math.min(currentPosition.y + liftPerFrame, TopReachPoint),
          z: currentPosition.z,
        });
      } else if (!allowCraneUp && currentPosition.y > bottomReachPoint) {
        craneRef.current.setTranslation({
          x: currentPosition.x,
          y: Math.max(currentPosition.y - liftPerFrame, bottomReachPoint),
          z: currentPosition.z,
        });
      }
    }

    if (LootBox01CraneRef.current && LootBox01Ref.current) {
      const currentCranePosition = vec3(
        LootBox01CraneRef.current.translation()
      );
      const currentLootPosition = vec3(LootBox01Ref.current.translation());

      const liftPerFrame = 0.08;
      const craneTopReachPoint = 13;
      const craneBottomReachPoint = 3.6;
      const lootTopReachPoint = 10;
      const lootBottomReachPoint = 0.6;

      // const lootDown = true;
      // const lootDown = false;
      const lootDown = undefined;
      // Calculate the new position for the LootBox01 to move in the opposite direction of craneRef
      if (
        (allowCraneUp && currentCranePosition.y <= craneTopReachPoint) ||
        lootDown
      ) {
        LootBox01Ref.current.setTranslation({
          x: currentLootPosition.x,
          y: Math.max(
            currentLootPosition.y - liftPerFrame,
            lootBottomReachPoint
          ),
          z: currentLootPosition.z,
        });
        LootBox01CraneRef.current.setTranslation({
          x: currentCranePosition.x,
          y: Math.max(
            currentCranePosition.y - liftPerFrame,
            craneBottomReachPoint
          ),
          z: currentCranePosition.z,
        });
      } else if (
        (!allowCraneUp && currentCranePosition.y >= craneBottomReachPoint) ||
        lootDown
      ) {
        LootBox01Ref.current.setTranslation({
          x: currentLootPosition.x,
          y: Math.min(currentLootPosition.y + liftPerFrame, lootTopReachPoint),
          z: currentLootPosition.z,
        });

        LootBox01CraneRef.current.setTranslation({
          x: currentCranePosition.x,
          y: Math.min(
            currentCranePosition.y + liftPerFrame,
            craneTopReachPoint
          ),
          z: currentCranePosition.z,
        });
      }
    }
  });

  const onPlayerEnterLootBox = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("LootBox01");
      }
    }
  };

  const onPlayerExitLootBox = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("");
      }
    }
  };

  const handleCameraDataEnter = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("CameraData");
      }
    }
  }

  const handleCameraDataExit = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player") {
        setCurrentHit("");
      }
    }
  }

  const handlePlayerEnterGoodBotNPC = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player" && currentHit !== "GoodBot") {
        console.log("enter NPC");
        setCurrentHit("GoodBot");
      }
    }
  };

  const handlePlayerExitGoodBotNPC = ({ other }) => {
    if (other.rigidBodyObject) {
      const { name } = other.rigidBodyObject;
      if (name === "player" && currentHit === "GoodBot") {
        console.log("exit NPC");
        setCurrentHit("");
      }
    }
  }

  return (
    <>
      <LaserTargetObject
        objectData={objectData}
        setCurrentLaserTarget={setCurrentLaserTarget}
        dropedObject={dropedObject}
        setDropedObject={setDropedObject}
        setObjectCollectedList={setObjectCollectedList}
        dataCollectNotify={dataCollectNotify} />

      <RigidBody
        name="Platform01"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-3.6, 7.5, 11.4]}
        scale={[400, 400, 250]}
        mass={20}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="SecurityCamera"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-2, 22, -23]}
        scale={[1, 1, 1]}
        mass={20}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(65),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "SecurityCamera",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        name="GoodBot01"
        key={"GoodBot01"}
        position={[-28, 0.7, -16]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(220),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={handlePlayerEnterGoodBotNPC}
        onCollisionExit={handlePlayerExitGoodBotNPC}
      >
        <CuboidCollider args={[1.5, 4, 5]} position={[2, 3, 2.5]} rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(45),
          degreeNumberToRadian(0),
        ]} />
        <GoodBot animation_index={1} />
      </RigidBody>
      <RigidBody
        type="fixed"
        // colliders="trimesh"
        name="GoodBot02"
        key={"GoodBot02"}
        colliders={false}
        position={[-31.7, 0.7, -16]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(160),
          degreeNumberToRadian(0),
        ]}
      >
        <GoodBot animation_index={0} />
      </RigidBody>
      <RigidBody
        type="fixed"
        // colliders="trimesh"
        name="GoodBot03"
        key={"GoodBot03"}
        colliders={false}
        scale={[1.25, 1.25, 1.25]}
        position={[-34, 0.1, -21.5]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <GoodBot animation_index={2} />
      </RigidBody>
      <RigidBody
        name="Speaker01"
        type="fixed"
        lockRotations
        lockTranslations
        position={[-35.5, 0.1, -13]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-20),
          degreeNumberToRadian(0),
        ]}
        scale={[0.07, 0.07, 0.07]}
      >
        <Item
          item={{
            name: "Speaker01",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="ComputerAccessCamera1"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-4.5, 9, 9]}
        scale={[0.05, 0.05, 0.05]}
        mass={20}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-65),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "MacDisplay",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="ComputerAccessCamera2"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-5, 9, 8]}
        scale={[0.05, 0.05, 0.05]}
        mass={20}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-30),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "MacDisplay",
            position: [0, 0, 70],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="SecurityTable"
        type="fixed"
        // colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-5.5, 7.5, 10]}
        scale={[2.5, 1.5, 2.5]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={handleCollisionSecurityEnter}
        onCollisionExit={handleCollisionSecurityExit}
      >
        <Item
          item={{
            name: "Table",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        lockRotations
        lockTranslations
        name="LadderL"
        colliders="trimesh"
        type="fixed"
        position={[-10.9, -0.5, 24]}
        scale={[6, 6, 6]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-180),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Ladder-L",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
          opacity={0.8}
        />
      </RigidBody>

      <RigidBody
        lockRotations
        lockTranslations
        name="ladder-slope-1"
        position={[-6.5, 2.5, 20]}
        scale={[9, 6, 0.1]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(25),
          degreeNumberToRadian(0),
        ]}
      >
        <Box args={[1, 1, 1]} position={[0, 0.2, 1]}>
          <meshStandardMaterial
            attach="material"
            color={"gray"}
            transparent
            opacity={0}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={"gray"} opacity={0} />
        </Box>
      </RigidBody>
      <RigidBody
        lockRotations
        lockTranslations
        name="ladder-slope-2"
        position={[-1.5, 6, 19]}
        scale={[5, 5.5, 0.1]}
        rotation={[
          degreeNumberToRadian(-60),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
      >
        <Box args={[1, 1, 1]} position={[0, 0.2, 1]}>
          <meshStandardMaterial
            attach="material"
            color={"gray"}
            transparent
            opacity={0}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={"gray"} opacity={0} />
        </Box>
      </RigidBody>

      <RigidBody
        name="LootBox01"
        type="fixed"
        ref={LootBox01Ref}
        position={[-36, 10, 8]}
        scale={[500, 400, 500]}
        mass={20}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterLootBox}
        onCollisionExit={onPlayerExitLootBox}
      >
        <group>
          <CuboidCollider args={[0.003, 0.003, 0.003]} position={[0, 0, 0]} />
        </group>
        <Item
          item={{
            name: "ScifiLoot",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        scale={[0.25, 0.25, 0.5]}
        position={[-40.1, 13, 6]}
        colliders="trimesh"
        ref={LootBox01CraneRef}
        name="crane02"
        lockRotations
        lockTranslations
        type="fixed"
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
        ]}
      >
        <mesh castShadow position={[-15.8, 8.5, 24]}>
          <boxGeometry args={[1, 1, 50]} />
          <meshStandardMaterial
            color={allowCraneUp ? "green" : "red"}
            opacity={0.6}
            transparent={true}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
          />
        </mesh>
        <mesh castShadow position={[-18.4, 8.5, 24]}>
          <boxGeometry args={[1, 1, 50]} />
          <meshStandardMaterial
            color={allowCraneUp ? "green" : "red"}
            opacity={0.6}
            transparent={true}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
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

      <RigidBody
        name="WeightComputer"
        type="fixed"
        key={"WeightComputer"}
        position={[-43, 2, 10]}
        scale={[500, 400, 500]}
        mass={20}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(10),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={handlePlayerEnterComputer}
        onCollisionExit={handlePlayerLeaveComputer}
      >
        <Item
          item={{
            name: "ScifiPC",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="weight-meter"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        scale={[3, 3, 3]}
        position={[-46, 0.8, 12]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(230),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "CountDownScreen",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 0.9, 1],
          }}
        />
        <Box
          key={"weight-meter-1"}
          args={[0.6, 0.3, 0.0001]}
          position={[0, 0.2, 0.03]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(1),
          ]}
        >
          <meshStandardMaterial
            attach="material"
            color={totalWeight >= 25 ? "green" : "white"}
            transparent
            opacity={0.75}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={totalWeight >= 25 ? "green" : "gray"} />
        </Box>
        <Box
          key={"weight-meter-2"}
          args={[0.6, 0.3, 0.0001]}
          position={[0, 0.6, 0.03]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(1),
          ]}
        >
          <meshStandardMaterial
            attach="material"
            color={totalWeight >= 50 ? "green" : "white"}
            transparent
            opacity={0.75}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={totalWeight >= 50 ? "green" : "gray"} />
        </Box>
        <Box
          key={"weight-meter-3"}
          args={[0.6, 0.3, 0.0001]}
          position={[0, 1, 0.03]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(1),
          ]}
        >
          <meshStandardMaterial
            attach="material"
            color={totalWeight >= 75 ? "green" : "white"}
            transparent
            opacity={0.75}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={totalWeight >= 75 ? "green" : "gray"} />
        </Box>
        <Box
          key={"weight-meter-4"}
          args={[0.6, 0.3, 0.0001]}
          position={[0, 1.4, 0.03]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(1),
          ]}
        >
          <meshStandardMaterial
            attach="material"
            color={totalWeight >= 100 ? "green" : "white"}
            transparent
            opacity={0.75}
            emissiveIntensity={0.5} // Set emissive intensity
          />
          <FakeGlowMaterial glowColor={totalWeight >= 100 ? "green" : "gray"} />
        </Box>
      </RigidBody>
      <RigidBody
        ref={craneRef}
        key={"plate"}
        name="plate"
        type="fixed"
        colliders="trimesh"
        position={[-40, 0.1, 19]}
        scale={[10, 1.5, 10]}
        mass={20}
        lockRotations
        lockTranslations
        onCollisionEnter={handleCollisionEnter}
        onCollisionExit={handleCollisionExit}
      >
        <Box args={[1, 0.2, 1]} castShadow>
          <meshStandardMaterial
            attach="material"
            color={"black"}
            transparent
            opacity={0.4}
            emissive={"black"}
            emissiveIntensity={1}
          />
          <FakeGlowMaterial glowColor={"white"} opacity={0.1} />
        </Box>
        <Item
          item={{
            name: "SteelCable",
            position: [-0.4, 0, -0.4],
            fileType: "glb",
            rotation: 0,
            scale: [1, 10, 1],
          }}
        />
        <Item
          item={{
            name: "SteelCable",
            position: [0.4, 0, -0.4],
            fileType: "glb",
            rotation: 0,
            scale: [1, 10, 1],
          }}
        />
        <Item
          item={{
            name: "SteelCable",
            position: [-0.4, 0, 0.4],
            fileType: "glb",
            rotation: 0,
            scale: [1, 10, 1],
          }}
        />
        <Item
          item={{
            name: "SteelCable",
            position: [0.4, 0, 0.4],
            fileType: "glb",
            rotation: 0,
            scale: [1, 10, 1],
          }}
        />
        <Box args={[0.005, 20, 0.005]} castShadow position={[0.4, 14, 0.4]}>
          <meshStandardMaterial
            attach="material"
            color={"black"}
            transparent
            opacity={0.4}
            emissive={"black"}
            emissiveIntensity={1}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
          />
        </Box>
        <Box args={[0.005, 20, 0.005]} castShadow position={[-0.4, 14, 0.4]}>
          <meshStandardMaterial
            attach="material"
            color={"black"}
            transparent
            opacity={0.4}
            emissive={"black"}
            emissiveIntensity={1}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
          />
        </Box>
        <Box args={[0.005, 20, 0.005]} castShadow position={[-0.4, 14, -0.4]}>
          <meshStandardMaterial
            attach="material"
            color={"black"}
            transparent
            opacity={0.4}
            emissive={"black"}
            emissiveIntensity={1}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
          />
        </Box>
        <Box args={[0.005, 20, 0.005]} castShadow position={[0.4, 14, -0.4]}>
          <meshStandardMaterial
            attach="material"
            color={"black"}
            transparent
            opacity={0.4}
            emissive={"black"}
            emissiveIntensity={1}
          />
          <FakeGlowMaterial
            glowColor={allowCraneUp ? "green" : "red"}
            opacity={0.5}
          />
        </Box>
      </RigidBody>
      <RigidBody
        key={"rock1"}
        name="WeightRock1"
        position={[-30, 8, 20]}
        scale={[150, 150, 150]}
        mass={20}
      >
        <Item
          item={{
            name: "WeightRock1",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="WeightRock2"
        key={"rock2"}
        position={[-30, 8, 20]}
        scale={[1, 1, 1]}
        mass={20}
      >
        <Item
          item={{
            name: "WeightRock2",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        name="WeightRock3"
        key={"rock3"}
        position={[-24, 8, 10]}
        scale={[300, 300, 300]}
        mass={20}
      >
        <Item
          item={{
            name: "WeightRock3",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>

      <RigidBody
        lockRotations
        lockTranslations
        position={[-8, 6.5, -16]}
        scale={[15, 15, 15]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-10),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ScifiRoom",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>

      <RigidBody
        lockRotations
        lockTranslations
        position={[-8, 6.5, -16]}
        scale={[15, 15, 15]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-10),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "ScifiRoom",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>

      <RigidBody
        lockRotations
        lockTranslations
        position={[-32, 4.5, -21]}
        scale={[5, 5.5, 5.5]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-85),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "SpaceBar",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        lockRotations
        lockTranslations
        position={[-8, 0, -16]}
        scale={[200, 300, 200]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-10),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "Platform",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <RigidBody
        ref={cameraRef}
        lockRotations
        lockTranslations
        name="camera"
        position={[-8.2, 4, -15.7]}
        scale={[3, 3, 3]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(135),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={handleCameraDataEnter}
        onCollisionExit={handleCameraDataExit}
      >
        <CuboidCollider args={[0.5, 1, 0.8]} position={[0, 0, 0]} />
        <Item
          item={{
            name: "Camera",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      {
        laserColor === "red" && (
          <RigidBody
            type="fixed"
            colliders={"trimesh"} // Conditionally set collider
            name={laserName} // Use dynamic name based on the laser's color
            lockRotations
            lockTranslations
            position={[-12, 4.65, -10]}
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(-31),
              degreeNumberToRadian(0),
            ]}
          >
            <Box args={[10, 9.5, 0.0001]} castShadow>
              <meshStandardMaterial
                attach="material"
                color={laserColor} // Use state variable for color
                transparent
                opacity={1}
                emissive={laserColor} // Add emissive color
                emissiveIntensity={1} // Set emissive intensity
              />
              <FakeGlowMaterial glowColor={laserColor} />
            </Box>
          </RigidBody>
        )
      }
      {
        laserColor === "green" && (
          <Box
            position={[-12, 4.65, -10]}
            args={[10, 9.5, 0.0001]}
            castShadow
            rotation={[
              degreeNumberToRadian(0),
              degreeNumberToRadian(-31),
              degreeNumberToRadian(0),
            ]}
          >
            <meshStandardMaterial
              attach="material"
              color={"green"} // Use state variable for color
              transparent
              opacity={1}
              emissiveIntensity={1} // Set emissive intensity
            />
            <FakeGlowMaterial glowColor={"green"} falloff={1} opacity={0.5} />
          </Box>
        )
      }
      <RigidBody
        name="countdown-computer"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        scale={[3, 3, 3]}
        position={[-20.5, 0.8, -12]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(190),
          degreeNumberToRadian(0),
        ]}
      >
        {[0.05, 0.5, 0.9, 1.3, 1.7].map((posY, index) => (
          <Box
            key={index}
            args={[0.6, 0.3, 0.0001]}
            castShadow
            position={[0, posY, 0.01]}
            name={`countdown-sec${index + 1}`}
          >
            <meshStandardMaterial
              attach="material"
              color={laserColor}
              transparent
              opacity={countdownOpacities[index]}
              emissive={laserColor} // Add emissive color
              emissiveIntensity={0.5} // Set emissive intensity
            />
          </Box>
        ))}
        <CountdownComputer />
      </RigidBody>
    </>
  );
};

export default Room2;
