import { Environment, OrbitControls } from "@react-three/drei";
import { Item } from "../../shared-object/object/Item";
import { RigidBody } from "@react-three/rapier";
import { useContext, useEffect } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { degreeNumberToRadian } from "../../../utils";
import { Tutorial } from "../map/Tutorial";
import FloatingCheckpoint from "../../shared-object/object/FloatingCheckpoint";
import { Mine } from "../../shared-object/object/Mine";

const items = [
  {
    name: "Arrow",
    position: [-5, 7, 4],
    rotation: -45,
    fileType: "glb",
  },
  {
    name: "Arrow",

    position: [-5.5, 10, -5],
    rotation: 1,
    fileType: "glb",
  },
  {
    name: "Arrow",
    position: [5, 0, -5],
    rotation: 45,
    fileType: "glb",
  },
  {
    name: "Arrow",
    position: [5, 2.5, 4],
    rotation: 2,
    fileType: "glb",
  },
];

const computer1 = {
  name: "computer_02_1",
  position: [6, 0, 5],
  rotation: 0,
  scale: [0.025, 0.025, 0.025],
  fileType: "obj",
  textures: [
    "/models/map_object/material_0_baseColor.png",
    "/models/map_object/material_1_baseColor.png",
  ],
};
export const TutorialEnvironment = ({ setHitCheckpoints }) => {
  useEffect(() => {}, []);

  const { currentCamera, currentHit, setCurrentHit, mines, setMines } =
    useContext(GameContext);
  return (
    <>
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
      {items.map((item, index) => (
        <FloatingCheckpoint
          item={item}
          index={index}
          setHitCheckpoints={setHitCheckpoints}
        />
      ))}

      <Tutorial />

      {mines.map((mine, index) => (
        <Mine mine={mine} index={index} setMines={setMines} />
      ))}

      <RigidBody
        colliders="trimesh"
        type="fixed"
        name="computer"
        position={[-10, 0, -7]}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
        ]}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            if (setCurrentHit) {
              setCurrentHit("computer");
            }
          }
        }}
        onCollisionExit={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            if (setCurrentHit) {
              setCurrentHit("");
            }
          }
        }}
      >
        <Item
          item={{
            name: "scifi_computer",
            position: [0, 0, 0],
            rotation: 0,
            scale: [2, 2, 2],
            fileType: "glb",
          }}
          key={1}
        />
      </RigidBody>
      {currentCamera === 2 && <OrbitControls />}
    </>
  );
};
