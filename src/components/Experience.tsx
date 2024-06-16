import { Environment, OrbitControls } from "@react-three/drei";
import { Home } from "../map/Home";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Home/>
      <Environment preset="sunset" />
    </>
  );
};