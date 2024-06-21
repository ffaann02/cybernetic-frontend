import { Environment, OrbitControls } from "@react-three/drei";
import { Home } from "../../map/Home";
import { Item } from "../shared/Item";

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

export const HomeEnvironment = () => {
  return (
    <>
      <directionalLight
        position={[40, 15, 20]}
        intensity={0.02}
        castShadow
        shadow-camera-near={0}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={20}
        shadow-camera-bottom={0}
        shadow-bias={-0.001}
      />

      {items.map((item, index) => (
        <Item item={item} key={index} />
      ))}
      <OrbitControls />
      <Home />
      <Environment preset="sunset" />
    </>
  );
};
