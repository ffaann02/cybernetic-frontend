import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CharacterController, {
  Controls,
} from "../../../controllers/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../../../contexts/GameContext";
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
  useKeyboardControls,
} from "@react-three/drei";
import { degreeNumberToRadian } from "../../../utils";
// import useSound from "use-sound";
import { Howl, Howler } from "howler";
import Level2ClassifyEnvironment from "../scene-object/SceneObject";
import GlassClassifierUI from "../ui/GlassClassifierUI";
import { Toast } from "primereact/toast";
import ComputerTestGlassUI from "../ui/ComputerTestGlassUI";
import TrainGlassClassifierUI from "../ui/TrainGlassClassifierUI";
import SceneObject from "../scene-object/SceneObject";
import { useLevel2Context } from "../../../contexts/SceneContext/Level2Context";

interface HomeProps {}

const Level2Classify: React.FC<HomeProps> = () => {
  const {
    debug,
    currentCamera,
    isUsingSecurityCamera,
    setIsUsingSecurityCamera,
    isInteracting,
    currentHit,
    setCurrentHit,
    setIsInteracting,
  } = useContext(GameContext);

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

  const [currentRoom, setCurrentRoom] = useState<number>(1);
  const door01_destination = useRef(null);
  const door01_back = useRef(null);
  const door02_destination = useRef(null);
  const door02_back = useRef(null);

  
  const {
    isOpenGlassClassifier,
    setIsOpenGlassClassifier,
    isActivateScanner,
    setIsActivateScanner,
    currentComputerGlassTest,
    setCurrentComputerGlassTest,
    isOpenGlassTest,
    setIsOpenGlassTest,
    resetTrigger,
    setResetTrigger,
    dangerPattern,
    setDangerPattern,
    ufoActiveList,
    setUfoActiveList,
    glassParameters,
    setGlassParameters,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    dataCollectNotify,
  } = useLevel2Context();

  const handlePressActivate = () => {
    setResetTrigger((prev) => prev + 1);
    console.log("parent pressed");
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenGlassTest(false);
    setIsOpenGlassClassifier(false);
    setTimeout(() => {
      setIsActivateScanner(true);
    }, 1000); // 1 second delay
  };


  const handleActivate = () => {
    setResetTrigger((prev) => prev + 1);
    const newDangerPattern = dangerPattern.reverse();
    setDangerPattern(newDangerPattern);
    setIsOpenGlassClassifier(false);
    console.log("activate glass");
    setIsInteracting(false);
    setCurrentHit("");
    setIsOpenGlassTest(false);
  }

  // handleActivate();
  return (
    <>
      {/* <CheckListGuideUI /> */}
      <Toast ref={dataCollectNotify} position="top-right" />
      {isOpenGlassClassifier && (
        <GlassClassifierUI
          isOpenGlassClassifier={isOpenGlassClassifier}
          setIsOpenGlassClassifier={setIsOpenGlassClassifier}
          handlePressActivate={handlePressActivate}
        />
      )}

      {isOpenGlassTest && (
        <ComputerTestGlassUI
          isOpenGlassTest={isOpenGlassTest}
          setIsOpenGlassTest={setIsOpenGlassTest}
          currentComputerGlassTest={currentComputerGlassTest}
          setCurrentComputerGlassTest={setCurrentComputerGlassTest}
          handleActivate={handleActivate}
          ufoActiveList={ufoActiveList}
          setUfoActiveList={setUfoActiveList}
        />
      )}

      {
        isOpenTrainComputer &&
        <TrainGlassClassifierUI
        isOpenTrainComputer={isOpenTrainComputer}
        setIsOpenTrainComputer={setIsOpenTrainComputer}
        glassParameters = {glassParameters}
        setGlassParameters = {setGlassParameters}
        />
      }

      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          {/* <fog attach="fog" args={["skyblue", 15, 30]} /> */}
          {/* <color attach="background" args={["black"]} /> */}
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          {/* <PerspectiveCamera makeDefault position={[0, 2, 10]} /> */}
          <ambientLight intensity={0.5} color={"lightblue"} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController spawnPosition={[
                -2,6,8
              ]} />
              <SceneObject
                currentRoom={currentRoom}
                setCurrentRoom={setCurrentRoom}
                door01_destination={door01_destination}
                door01_back={door01_back}
                door02_destination={door02_destination}
                door02_back={door02_back}
              />
            </Physics>
          </Suspense>
          {isUsingSecurityCamera && (
            <PerspectiveCamera
              makeDefault
              // ref={cameraRef}
              position={[-18, 50, 20]}
              rotation={[
                degreeNumberToRadian(-50),
                degreeNumberToRadian(0),
                degreeNumberToRadian(0),
              ]}
            />
          )}
          <OrbitControls/>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level2Classify;
