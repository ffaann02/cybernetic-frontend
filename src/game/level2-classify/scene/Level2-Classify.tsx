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
import Level3SoundGenEnvironment from "../scene-object/Level2-Classify";
import { SecurityCamera } from "../../level1-datalab/scene-object/room/SecurityCamera";
import { degreeNumberToRadian } from "../../../utils";
import CheckListGuideUI from "../ui/CheckListGuideUI";
// import useSound from "use-sound";
import { Howl, Howler } from "howler";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import CDStorageUI from "../ui/CDStorageUI";
import Level2ClassifyEnvironment from "../scene-object/Level2-Classify";
import VideoFootageUI from "../ui/VideoFootageUI";
import GlassClassifierUI from "../ui/GlassClassifierUI";
import { Toast } from "primereact/toast";
import ComputerTestGlassUI from "../ui/ComputerTestGlassUI";
import TrainGlassClassifierUI from "../ui/TrainGlassClassifierUI";

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

  const [isOpenAudioInput, setIsOpenAudioInput] = useState(false);
  const [isOpenVideoFootage, setIsOpenVideoFootage] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const [isOpenCD, setIsOpenCD] = useState(false);
  const [isOpenTrainComputer, setIsOpenTrainComputer] = useState(false);
  const [isOpenGlassClassifier, setIsOpenGlassClassifier] = useState(false);
  const [isActivateScanner, setIsActivateScanner] = useState(false);
  const [currentComputerGlassTest, setCurrentComputerGlassTest] = useState(0);
  const [isOpenGlassTest, setIsOpenGlassTest] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [dangerPattern, setDangerPattern] = useState([2,2,2,1,2,2]);
  const [ufoActiveList, setUfoActiveList] = useState([false, false, false]);
  const [glassParameters, setGlassParameters] = useState([]);

  const handleAudioEnd = () => {
    console.log("hello end");
    setIsPlayingSound(false);
  };

  const handlePlaySound = (selectedAudioPath, volume, isLooping) => {
    console.log(selectedAudioPath, volume, isLooping);
    setSelectedAudioPath(selectedAudioPath);
    setVolume(volume);
    setIsLooping(isLooping);
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenAudioInput(false);
    setIsPlayingSound(true);
    // Toggle the playTrigger to ensure useEffect triggers
    var sound = new Howl({
      src: [selectedAudioPath],
      volume: volume,
      loop: isLooping,
      onend: handleAudioEnd,
    });

    sound.play();
  };

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

  const dataCollectNotify = useRef(null);

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
              <Level2ClassifyEnvironment
                currentRoom={currentRoom}
                setCurrentRoom={setCurrentRoom}
                door01_destination={door01_destination}
                door01_back={door01_back}
                isOpenGlassClassifier={isOpenGlassClassifier}
                setIsOpenGlassClassifier={setIsOpenGlassClassifier}
                isActivateScanner={isActivateScanner}
                setIsActivateScanner={setIsActivateScanner}
                dataCollectNotify={dataCollectNotify}
                door02_destination={door02_destination}
                door02_back={door02_back}
                isOpenGlassTest={isOpenGlassTest}
                setIsOpenGlassTest={setIsOpenGlassTest}
                currentComputerGlassTest={currentComputerGlassTest}
                setCurrentComputerGlassTest={setCurrentComputerGlassTest}
                resetTrigger={resetTrigger}
                setResetTrigger={setResetTrigger}
                dangerPattern={dangerPattern}
                setDangerPattern={setDangerPattern}
                ufoActiveList={ufoActiveList}
                setUfoActiveList={setUfoActiveList}
                glassParameters={glassParameters}
                setGlassParameters={setGlassParameters}
                isOpenTrainComputer={isOpenTrainComputer}
                setIsOpenTrainComputer={setIsOpenTrainComputer}
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
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level2Classify;
