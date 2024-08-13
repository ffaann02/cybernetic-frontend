import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useEffect, useMemo, useRef } from "react";
import { SceneObject } from '../scene-object/SceneObject';
import { Physics } from "@react-three/rapier";
import SmoothCamera from "../../../controllers/SmoothCamera";
import HomeMenu from "../ui/HomeMenu";
import { GameContext } from "../../../contexts/GameContext";
import { OrbitControls } from "@react-three/drei";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const { debug } = useContext(GameContext);

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        style={{ height: "100%", width: "100%" }}
        shadows
        className="z-0"
      >

        <color attach="background" args={["gray"]} />
        {/* <SmoothCamera targetPosition={[-6.1, 2.5, -8.8]} rotation={[0, 3.45, 0]}/> */}
        <OrbitControls />

        <Suspense fallback={null}>
          <Physics debug={debug} gravity={[0, -9.81, 0]}>
            <SceneObject  />
          </Physics>
        </Suspense>
      </Canvas>
      {/* <HomeMenu /> */}
    </>
  );
};

export default Home;
