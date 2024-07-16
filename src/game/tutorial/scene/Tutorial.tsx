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
import { TutorialEnvironment } from "../scene-object/Tutorial";
import AssistantBotController from "../../../controllers/AssistantBotController";
import RobotIdle from "../../../assets/assistant-bot/gif/Idle.gif";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import EnemyGuardController from "../../../controllers/EnemyGuardController";

interface HomeProps { }

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

  const [navigation, setNavigation] = useState<string[]>([
    "checkpoint_0",
    "checkpoint_1",
    "checkpoint_2",
    "checkpoint_3",
  ]);

  const [hitCheckpoints, setHitCheckpoints] = useState<number>(0);

  const [tutorialChat, setTutorialChat] = useState<string[]>([
    "Hello, I am X-Alpha, your personal assistant. Welcome to Operation Cybernetic. You may be wondering what happened to you? Where are you? And what is Operation Cybernetic? Would you like me to tell you?",
    `Good Job! Next, Let's try to press "I" to open Inventory. You can see the items you have collected in the inventory. Press "I" again to close the inventory.`,
  ]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentSuccess, setCurrentSuccess] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  useEffect(() => {
    if (hitCheckpoints >= 4) {
      setCurrentSuccess(1);
      setCurrentStep(1);
      setIsChatOpen(true);
    }
  }, [hitCheckpoints]);

  const [trackPressI, setTrackPressI] = useState<number>(0);

  useEffect(() => {
    if (trackPressI >= 2 && currentStep === 1) {
      setCurrentSuccess(2);
      setCurrentStep(2);
      setIsChatOpen(true);
    }
  }, [trackPressI]);

  return (
    <>
      {currentStep === 0 && (
        <div className="absolute right-6 top-6 z-[100] flex flex-col gap-y-2 transition-all duration-200 ease-linear">
          <Message
            severity={hitCheckpoints >= 4 ? "success" : "info"}
            text="Pick the 4 
        checkpoints to complete the movement tutorial."
          />
        </div>
      )}
      <div
        className={`${isChatOpen ? "block" : "hidden"
          } bg-black/70 h-full w-full fixed bottom-0 z-[1000] flex justify-center items-center`}
      >
        <div className="flex max-w-5xl">
          <img src={RobotIdle} className="" />
          <div>
            <Fieldset
              legend="X-Alpha"
              className="-ml-2 px-2 mt-4 min-w-80 bg-blue-800/40 rounded-xl border-4 border-white shadow-lg shadow-white"
            >
              <p className="m-0 text-xl font-semibold text-white">
                {tutorialChat[currentSuccess]}
              </p>
              <div className="mt-4 gap-x-4 flex">
                {currentStep !== 0 && currentSuccess !== 0 && (
                  <Button
                    label="OK, I understand."
                    icon="pi pi-check"
                    className="text-lg"
                    onClick={() => {
                      setIsChatOpen(false);
                    }}
                  />
                )}
                {currentStep === 0 && currentSuccess === 0 && (
                  <>
                    <Button
                      label="Yes, please tell me.
                "
                      icon="pi pi-check"
                      className="text-lg"
                      onClick={() => {
                        setCurrentSuccess((prev) => prev + 1);
                        // Log currentSuccess value after update
                      }}
                    />{" "}
                    <Button
                      label="No, I am good"
                      icon="pi pi-times"
                      className="text-lg"
                      severity="danger"
                      onClick={() => {
                        setIsChatOpen(false);
                      }}
                    />
                  </>
                )}
              </div>
            </Fieldset>
          </div>
        </div>
      </div>
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          <fog attach="fog" args={["skyblue", 15, 30]} />
          <color attach="background" args={["black"]} />
          {camera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 6, 10]} />
          )}
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <EnemyGuardController
                speed={3}
                point1={[-6, 0.5, -10]}
                point2={[-6, 0.5, 10]}
                showPath={true} />
              <AssistantBotController />
              <TutorialEnvironment setHitCheckpoints={setHitCheckpoints} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Tutorial;
