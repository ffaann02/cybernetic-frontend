import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CharacterController, {
  Controls,
} from "../../../controllers/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../../../contexts/GameContext";
import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { SceneObject } from "../scene-object/SceneObject";
import AssistantBotController from "../../../controllers/AssistantBotController";
import RobotIdle from "../../../assets/assistant-bot/gif/Idle.gif";
import TutorialMovementChecklistUI from "../ui/TutorialMovementChecklistUI";
import { useTutorialContext } from "../../../contexts/SceneContext/TutorialContext";
import MovementGuideUI from "../ui/MovementGuideUI";
import MovementTutorialUI from "../ui/MovementTutorialUI";
import EPressedTutorialUI from "../ui/ePressedTutorialUI";
import { Toast } from "primereact/toast";
import EPressedChecklistUI from "../ui/ePressedChecklistUI";

interface HomeProps {}

const Tutorial: React.FC<HomeProps> = () => {
  const { debug, currentCamera } = useContext(GameContext);

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
      { name: Controls.L, keys: ["KeyL"] },
    ],
    []
  );

  const {
    hitCheckpoints,
    setHitCheckpoints,
    tutorialStep,
    setTutorialStep,
    isOk,
    setIsOk,
    toastRef,
  } = useTutorialContext();

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      {!isOk && tutorialStep === 0 && <MovementTutorialUI />}
      {isOk && tutorialStep === 0 && hitCheckpoints < 4 && <MovementGuideUI />}
      {!isOk && tutorialStep === 1 && <EPressedTutorialUI />}
      {isOk && tutorialStep === 0 && <TutorialMovementChecklistUI />}
      {isOk && tutorialStep === 1 && <EPressedChecklistUI />}
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          {/* <fog attach="fog" args={["skyblue", 15, 30]} /> */}
          <color attach="background" args={["black"]} />
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 6, 10]} />
          )}
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController spawnPosition={[-30, 4, 0]} />
              <SceneObject
                hitCheckpoints={hitCheckpoints}
                setHitCheckpoints={setHitCheckpoints}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Tutorial;
