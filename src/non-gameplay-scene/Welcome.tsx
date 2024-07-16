import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext } from "react";
import { Physics } from "@react-three/rapier";
import { PerspectiveCamera } from "@react-three/drei";
import { GameContext } from "../contexts/GameContext";
import { WelcomeEnviroment } from "./WelcomeEnvironment";

interface HomeProps {}

const Welcome: React.FC<HomeProps> = () => {
  const { debug } = useContext(GameContext);

  return (
    <>
      {/* <div className="absolute z-10 w-1/3 h-screen right-0">hello</div> */}
      <Canvas
        style={{ height: "100%", width: "100%" }}
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
        className="z-0"
      >
        <color attach="background" args={["black"]} />
        <PerspectiveCamera
          makeDefault
          position={[0, 10, 10]}
          rotation={[-Math.PI / 4, 0, 0]}
        />
        <Suspense fallback={null}>
          <Physics debug={debug}>
            <WelcomeEnviroment />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default Welcome;
