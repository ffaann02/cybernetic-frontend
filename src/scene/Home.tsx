import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useEffect, useMemo, useRef } from "react";
import { HomeEnvironment } from "../components/scene-environments/Home";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { PerspectiveCamera } from "@react-three/drei";
import SmoothCamera from "../controllers/SmoothCamera";
import HomeMenu from "../components/ui/main-menu/HomeMenu";

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const { debug, camera } = useContext(GameContext);

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (cameraRef.current) {
      console.log(cameraRef.current.position);
    }
  }, [cameraRef?.current?.position]);

  const displayCameraPosition = () => {
    console.log(cameraRef.current.position);
  }


  return (
    <>
      <Canvas
        dpr={[1, 2]}
        style={{ height: "100%", width: "100%" }}
        shadows
        className="z-0"
      >

        <color attach="background" args={["gray"]} />
        <SmoothCamera targetPosition={[-6.1, 2.5, -8.8]} rotation={[0, 3.45, 0]}/>

        <Suspense fallback={null}>
          <Physics debug={debug} gravity={[0, -9.81, 0]}>
            <HomeEnvironment />
          </Physics>
        </Suspense>
      </Canvas>
      <HomeMenu />
    </>
  );
};

export default Home;
