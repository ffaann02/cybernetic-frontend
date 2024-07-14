import { Environment, OrbitControls } from "@react-three/drei";
import { Home } from "../../map/Home";
import { Item } from "./shared/Item";
import { RigidBody } from "@react-three/rapier";
import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";

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
    position: [4, 0, 3],
    rotation: 45,
  },
  {
    name: "StreetLight",
    position: [10, 0, 1],
    rotation: -45,
  },
];

export const SimpleEnvironment = () => {
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

      {/* <EnemyFollow
        speed={3}
        position={[0, 6, 0]}
        showArea={true}
        areaRadius={4} /> */}

      {/* {items.map((item, index) => (
        <RigidBody name="item" lockTranslations lockRotations>
          <Item item={item} key={index} />
        </RigidBody>
      ))} */}
      <Home />
      {camera === 2 && <OrbitControls />}
    </>
  );
};
