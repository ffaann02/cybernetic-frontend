import { Environment, OrbitControls } from "@react-three/drei";
import { Home } from "../map/Home";
import { Item } from "./shared/Item";

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
];

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Home />
      {items.map((item, index) => (
        <Item item={item} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
