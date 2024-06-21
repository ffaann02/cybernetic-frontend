import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { HomeEnvironment } from "../components/scene-environments/Home";
import { PerspectiveCamera } from "@react-three/drei";
import CharacterController from "../constant/CharacterController";
import { Physics } from "@react-three/rapier";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <Canvas dpr={[1, 2]} style={{ height: "100%", width: "100%" }} shadows>
      <color attach="background" args={["lightblue"]} />
      {/* <PerspectiveCamera makeDefault position={[0, 6, 10]} /> */}
      <Suspense fallback={null}>
        <Physics debug={false}>
          <CharacterController />
          <HomeEnvironment />
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default Home;
