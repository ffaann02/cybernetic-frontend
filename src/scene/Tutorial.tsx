import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useMemo } from "react";
import CharacterController, {
  Controls,
} from "../controllers/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { TutorialEnvironment } from "../components/scene-environments/Tutorial";
import AssistantBotController from "../controllers/AssistantBotController";
import EnemySimple from "../game_object/enemy/EnemySimple";

interface HomeProps {}

const Tutorial: React.FC<HomeProps> = () => {
  const { debug, camera } = useContext(GameContext);

  const controlMap = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.coding, keys: ["KeyE"] },
      { name: Controls.interact, keys: ["KeyR"] },
      { name: Controls.ESC, keys: ["Escape"] },
    ],
    []
  );

  return (
    <>
      {/* <div
        className="bg-black/50 h-full w-full fixed
    bottom-0 z-[100]"
      >
        <div id="chat-assistant-robot-container" className="bg-red-200">
        </div>
      </div> */}
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          <fog attach="fog" args={['skyblue', 15, 30]} />
          <color attach="background" args={["black"]} />
          {camera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 6, 10]} />
          )}
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <EnemySimple 
              speed={3}
              point1={[-6, 0.5, -10]}
              point2={[-6,0.5,10]}
              showPath={true}/>
              <AssistantBotController />
              <TutorialEnvironment />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Tutorial;
