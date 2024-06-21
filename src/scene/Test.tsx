import { Canvas } from "@react-three/fiber";
import React from "react";
import { HomeEnvironment } from "../components/scene-environments/Home";

interface HomeProps {}

const Test: React.FC<HomeProps> = () => {
  return (
    <Canvas style={{ height: "100%", width: "100%" }} shadows camera={{ position: [10, 10, 10], fov: 60 }}>
      <color attach="background" args={["red"]} />
      <HomeEnvironment />
    </Canvas>
  );
};

export default Test;
