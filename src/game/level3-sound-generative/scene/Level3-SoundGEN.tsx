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
import { enemyPartrolProps } from "../scene-object/EnemyDataProps";
import Level3SoundGenEnvironment from "../scene-object/Level3-SoundGEN";
import { SecurityCamera } from "../../level1-datalab/scene-object/room/SecurityCamera";
import { degreeNumberToRadian } from "../../../utils";
import CheckListGuideUI from "../ui/CheckListGuideUI";
import AudioInputUI from "../ui/AudioInputUI";
import VideoFootageUI from "../ui/VideoFootageUI";
import useAudio from "../../../hooks/useAudio";
// import useSound from "use-sound";
import {Howl, Howler} from 'howler';
import { Bloom, EffectComposer } from "@react-three/postprocessing";

interface HomeProps {}

const Level3SoundGEN: React.FC<HomeProps> = () => {
  const {
    debug,
    currentCamera,
    isUsingSecurityCamera,
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

  const [enemyPatrolInScene, setEnemyPatrolInScene] =
    useState(enemyPartrolProps);
  const [currentRoom, setCurrentRoom] = useState<number>(1);
  const door01_destination = useRef(null);
  const door01_back = useRef(null);
  const [isOpenAudioInput, setIsOpenAudioInput] = useState(false);
  const [isOpenVideoFootage, setIsOpenVideoFootage] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(false);  

  const [volume, setVolume] = useState(0.5);
  const [selectedAudioPath, setSelectedAudioPath] = useState("");
  const [isLooping, setIsLooping] = useState(false);


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
      onend: handleAudioEnd
    });

    sound.play();
  };

  return (
    <>
      <CheckListGuideUI />
      {isOpenAudioInput && (
        <AudioInputUI
          setIsOpenAudioInput={setIsOpenAudioInput}
          isPlayingSound={isPlayingSound}
          setIsPlayingSound={setIsPlayingSound}
          handlePlaySound={handlePlaySound}
        />
      )}
      {isOpenVideoFootage && (
        <VideoFootageUI
          isOpenVideoFootage={isOpenVideoFootage}
          setIsOpenVideoFootage={setIsOpenVideoFootage}
        />
      )}
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
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          {/* <PerspectiveCamera makeDefault position={[0, 2, 10]} /> */}
          <ambientLight intensity={0.5} color={"lightblue"} />
          {/* <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              height={50}
            />
          </EffectComposer> */}
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <Level3SoundGenEnvironment
                currentRoom={currentRoom}
                setCurrentRoom={setCurrentRoom}
                door01_destination={door01_destination}
                door01_back={door01_back}
                setEnemyPatrolInScene={setEnemyPatrolInScene}
                isOpenAudioInput={isOpenAudioInput}
                setIsOpenAudioInput={setIsOpenAudioInput}
                isOpenVideoFootage={isOpenVideoFootage}
                setIsOpenVideoFootage={setIsOpenVideoFootage}
                isPlayingSound={isPlayingSound}
                setIsPlayingSound={setIsPlayingSound}
              />
            </Physics>
          </Suspense>
          {isUsingSecurityCamera && (
            <PerspectiveCamera
              makeDefault
              // ref={cameraRef}
              position={[-15, 60, 30]}
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

export default Level3SoundGEN;
