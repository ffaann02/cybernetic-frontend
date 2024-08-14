import React, { memo, useContext, useRef, useState } from "react";
import {
  Environment,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { GameContext } from "../../../contexts/GameContext";
import Level6Room1Environment from "./room1/Level6-Room1-Environment";
import { MapRoom1 } from "../map/MapRoom1";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../utils";
import { Item } from "../../shared-object/object/Item";
import { Controls } from "../../../controllers/CharacterController";
import { useFrame } from "@react-three/fiber";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import OcrPasswordUI from "../ui/OcrPasswordUI";

export const Room = memo(({ children }) => {
  return <>{children}</>;
});

export const SceneObject = ({}) => {
  const { currentHit, setCurrentHit, setIsInteracting } =
    useContext(GameContext);
  const { isOpenOcrPassword, setIsOpenOcrPassword, setIsOpenCharacterStorage } = useLevel4Context();
  const [lastPressTime, setLastPressTime] = useState(0);
  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const flashDriveRef = useRef(null);

  const onPlayerEnterSecretPassword = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("Level4-OCR-Computer");
    }
  };

  const onPlayerExitSecretPassword = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
    }
  };

  useFrame(({ clock }) => {
    if (ePressed && currentHit === "Level4-OCR-Computer") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsInteracting((prev) => !prev);
        setIsOpenOcrPassword((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }

    if (ePressed && currentHit === "Level4-CharacterStorage") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsInteracting((prev) => !prev);
        setIsOpenCharacterStorage((prev) => !prev);
        setLastPressTime(currentTime);
      }
    }

    if (flashDriveRef.current) {
      const time = clock.getElapsedTime();
      const newY = 3 + Math.sin(time) * 1; // Oscillate between 1.5 and 2.5
      flashDriveRef.current.setTranslation(
        { x: -33, y: newY, z: 22 },
        true
      );
    }
  });

  const onPlayerEnterFlashDrive = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      console.log("hello");
      setCurrentHit("Level4-CharacterStorage");
    }
  };

  const onPlayerExitFlashDrive = ({ other }) => {
    if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
      setCurrentHit("");
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
      <RigidBody
        type="fixed"
        colliders={"trimesh"}
        position={[-36, 0, 10]}
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
            position: [0, -0.15, 0.62],
            scale: [0.000001, 0.000001, 0.000001],
            fileType: "glb",
            rotation: [
              degreeNumberToRadian(180),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
          }}
        />
        <Item
          item={{
            name: "SuperComputer",
            position: [0, 1.5, 0],
            scale: [0.000001, 0.000001, 0.000001],
            fileType: "glb",
          }}
        />
        <Item
          item={{
            name: "SuperComputer",
            position: [0, 3, 0],
            scale: [0.000001, 0.000001, 0.000001],
            fileType: "glb",
          }}
        />
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        mass={0}
        type="fixed"
        position={[-2.5, 0, 34]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
          degreeNumberToRadian(0),
        ]}
        scale={[3, 3, 3]}
      >
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.3, 2, 0.9]} />
          <meshStandardMaterial
            color={"red"}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
        <Item
          item={{
            name: "door-border",
            position: [0, 0, 0],
            fileType: "glb",
          }}
          isOutlined={true}
        />
      </RigidBody>
      <RigidBody
        colliders={false}
        mass={0}
        type="fixed"
        position={[-4, 0, 30]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-30),
          degreeNumberToRadian(0),
        ]}
        scale={[400, 300, 400]}
        lockTranslations
        lockRotations
        onCollisionEnter={onPlayerEnterSecretPassword}
        onCollisionExit={onPlayerExitSecretPassword}
      >
        <Item
          item={{
            name: "ScifiComputer",
            position: [0, 0, 0],
            fileType: "glb",
          }}
          isOutlined={true}
          outlineColor={"cyan"}
          outlineThickness={4}
        />
        <CuboidCollider
          args={[0.0045, 0.01, 0.0045]}
          position={[0, 0.012, 0]}
        />
      </RigidBody>
      <RigidBody
        colliders={"trimesh"}
        mass={0}
        type="fixed"
        position={[-20, 4.7, 1]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
          degreeNumberToRadian(0),
        ]}
        scale={[2, 2, 2]}
        lockTranslations
        lockRotations
      >
        <Item
          item={{
            name: "Bookshelf",
            position: [0, 0, 0],
            fileType: "glb",
          }}
          isOutlined={true}
          outlineColor={"white"}
          outlineThickness={2}
        />
        <CuboidCollider
          args={[0.0045, 0.01, 0.0045]}
          position={[0, 0.012, 0]}
        />
      </RigidBody>
      <RigidBody
        colliders={"trimesh"}
        mass={0}
        type="fixed"
        position={[-29.5, 4.7, 1.5]}
        rotation={[
          degreeNumberToRadian(-10),
          degreeNumberToRadian(200),
          degreeNumberToRadian(0),
        ]}
        scale={[2, 2, 2]}
        lockTranslations
        lockRotations
      >
        <Item
          item={{
            name: "Bookshelf",
            position: [0, 0, 0],
            fileType: "glb",
          }}
          isOutlined={true}
          outlineColor={"white"}
          outlineThickness={2}
        />
        <CuboidCollider
          args={[0.0045, 0.01, 0.0045]}
          position={[0, 0.012, 0]}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-33, 0.75, 22]}
        scale={[500, 500, 500]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-10),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterFlashDrive}
        onCollisionExit={onPlayerExitFlashDrive}
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
        ref={flashDriveRef}
        type="fixed"
        colliders={false}
        position={[-33, 2.5, 22]}
        scale={[500, 500, 500]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-10),
          degreeNumberToRadian(0),
        ]}
      >
        <Item
          item={{
            name: "FlaskDrive",
            position: [0, 0, 0],
            scale: [0.001, 0.001, 0.001],
            rotation: [
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="cyan"
          outlineThickness={2}
        />
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-16.5, 0.75, 26]}
        scale={[500, 500, 500]}
        lockRotations
        lockTranslations
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(230),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={onPlayerEnterFlashDrive}
        onCollisionExit={onPlayerExitFlashDrive}
      >
        <CuboidCollider
          args={[0.0024, 0.006, 0.0021]}
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
          outlineColor="cyan"
          outlineThickness={3}
        />
        <Item
          item={{
            name: "Monitor-Audio",
            position: [0, 0.0024, 0],
            scale: [0.00005, 0.00005, 0.00005],
            rotation: [
              degreeNumberToRadian(-90),
              degreeNumberToRadian(0),
              degreeNumberToRadian(0),
            ],
            fileType: "glb",
          }}
          isOutlined
          outlineColor="cyan"
          outlineThickness={3}
        />
      </RigidBody>
      <MapRoom1 />
    </>
  );
};
