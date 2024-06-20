import { Canvas } from "@react-three/fiber";
import React from "react";
import { Experience } from "../components/Experience";

interface HomeProps {}

const Test: React.FC<HomeProps> = () => {
  return (
    <Canvas style={{ height: "100%", width: "100%" }} shadows camera={{ position: [10, 10, 10], fov: 60 }}>
      <color attach="background" args={["red"]} />
      <Experience />
    </Canvas>
  );
};

export default Test;
