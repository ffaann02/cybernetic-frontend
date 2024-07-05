import { Environment, OrbitControls } from "@react-three/drei";
import { Home } from "../../map/Home";
import { Item } from "./shared/Item";
import { RigidBody } from "@react-three/rapier";
import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import Wall from "./shared/Wall";
import { ItemWithUrl } from "./shared/ItemWithUrl";

const items = [
  {
    name: "StreetLight",
    position: [10, 0, 0],
    rotation: -45,
  },
  {
    name: "Tank",
    position: [2, 0, 0],
    rotation: 1,
  },
  {
    name: "Tank",
    position: [2, 0, 3],
    rotation: 45,
  },
  {
    name: "StreetLight",
    position: [10, 0, 1],
    rotation: -45,
  },
];

export const TutorialEnvironment = () => {
  const { camera } = useContext(GameContext);
  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={1}
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
        <RigidBody name="item" lockTranslations lockRotations>
          <Item item={item} key={index} />
        </RigidBody>
      ))}

      <ItemWithUrl item={{ name: "Tank", position: [8, 1, 0], rotation: 0 }} />

      <Home />

      <Wall
        color="skyblue"
        position={[0, 1.25, 11.2]}
        scale={[2.6, 1, 1]}
        rotation={[0, 0, 0]}
      />

      <Wall
        color="skyblue"
        position={[0, 1.25, -11.3]}
        scale={[2.6, 1, 1]}
        rotation={[0, 0, 0]}
      />

      <Wall
        color="skyblue"
        position={[13, 1.25, -0.05]}
        scale={[2.3, 1, 1]}
        rotation={[0, 90, 0]}
      />

      <Wall
        color="skyblue"
        position={[-13, 1.25, -0.05]}
        scale={[2.3, 1, 1]}
        rotation={[0, 90, 0]}
      />
      {camera === 2 && <OrbitControls />}
    </>
  );
};
