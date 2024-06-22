import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext } from "react";
import { HomeEnvironment } from "../components/scene-environments/Home";
import CharacterController from "../constant/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { PerspectiveCamera } from "@react-three/drei";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { debug, camera } = useContext(GameContext);
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ height: "100%", width: "100%" }}
      shadows
      className="z-0"
    >
      <color attach="background" args={["lightblue"]} />
      {camera === 2 && <PerspectiveCamera makeDefault position={[0, 6, 10]} />}
      <Suspense fallback={null}>
        <Physics debug={debug}>
          <CharacterController />
          <HomeEnvironment />
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default Home;
