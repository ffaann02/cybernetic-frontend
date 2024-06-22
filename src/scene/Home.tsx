import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useMemo } from "react";
import { HomeEnvironment } from "../components/scene-environments/Home";
import CharacterController, { Controls } from "../constant/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { debug, camera } = useContext(GameContext);

  const controlMap = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <KeyboardControls map={controlMap}>
      <Canvas
        dpr={[1, 2]}
        style={{ height: "100%", width: "100%" }}
        shadows
        className="z-0"
      >
        <color attach="background" args={["gray"]} />
        {camera === 2 && (
          <PerspectiveCamera makeDefault position={[0, 6, 10]} />
        )}
        <Suspense fallback={null}>
          <Physics debug={debug} gravity={[0, -9.81, 0]}>
            <CharacterController />
            <HomeEnvironment />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
};

export default Home;
