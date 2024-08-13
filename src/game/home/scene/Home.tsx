import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useContext, useState } from "react";
import { SceneObject } from "../scene-object/SceneObject";
import { Physics } from "@react-three/rapier";
import SmoothCamera from "../../../controllers/SmoothCamera";
import HomeMenu from "../ui/HomeMenu";
import { GameContext } from "../../../contexts/GameContext";
import { OrbitControls } from "@react-three/drei";
import SceneObjectNew from "../scene-object/SceneObjectNew";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  LensFlare,
  Pixelation,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { HiUsers } from "react-icons/hi";
import { IoGameController } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { MdExitToApp } from "react-icons/md";

interface HomeProps {}

const Effects: React.FC = () => {
  const [density, setDensity] = useState(0.6);
  const [opacity, setOpacity] = useState(0.12);
  const [luminanceThreshold, setLuminanceThreshold] = useState(0.3);
  const [scanlineDirection, setScanlineDirection] = useState(1);
  const [bloomDirection, setBloomDirection] = useState(1);

  useFrame(() => {
    setDensity((prev) => {
      const newDensity = prev + 0.005 * scanlineDirection; // Smaller increment for smoother transition
      if (newDensity >= 1 || newDensity <= 0.6) {
        setScanlineDirection((prev) => -prev); // Reverse direction when limits are hit
      }
      return newDensity;
    });

    setOpacity((prev) => {
      const newOpacity = prev + 0.01 * scanlineDirection;
      if (newOpacity >= 0.2 || newOpacity <= 0.12) {
        setScanlineDirection((prev) => -prev); // Reverse direction when limits are hit
      }
      return newOpacity;
    });

    setLuminanceThreshold((prev) => {
      const newThreshold = prev + 0.01 * bloomDirection;
      if (newThreshold >= 0.5 || newThreshold <= 0.3) {
        setBloomDirection((prev) => -prev); // Reverse direction when limits are hit
      }
      return newThreshold;
    });
  });

  return (
    <EffectComposer>
      <SceneObjectNew />
      <Scanline density={density} opacity={opacity} />
      <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
    </EffectComposer>
  );
};

const Home: React.FC<HomeProps> = () => {
  const { debug, setScene, setGameState, previousScene } = useContext(GameContext);

  const handleSelectStoryMode = () => {
    if (setGameState) {
      setGameState((prevState) => ({ ...prevState, currentScene: "level-selection" }));
    }
  };

  return (
    <>
      <button className="absolute top-4 right-4 flex bg-cyan-400/50 p-2 border-2 border-cyan-200 
        rounded-lg">
        <MdExitToApp className="text-4xl text-cyan-200" />
      </button>
      <div className="absolute h-full max-h-screen w-1/3 z-50">
        <div className="px-20 mt-16">
          <img src="/images/Logo_V1.png" />
        </div>
        <div className="flex flex-col gap-y-4 w-[80%] mx-auto mt-10">
          <button
            onClick={handleSelectStoryMode}
            className="text-4xl bg-cyan-400/50 py-3 rounded-xl font-semibold text-cyan-200 border-2 border-cyan-200
    hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear flex items-center justify-center"
          >
            <IoGameController className="text-5xl mr-2" />
            STORY MODE
          </button>
          <button
            className="text-4xl flex w-full justify-center bg-cyan-400/50 py-3 rounded-xl font-semibold text-cyan-200 border-2 border-cyan-200
    hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear flex items-center justify-center"
          >
            <HiUsers className="text-5xl mr-2" />
            <span className="flex flex-col items-center">
              MULTIPLAYER
              <p className="text-sm font-normal text-white -mt-1">
                (Story mode completed require)
              </p>
            </span>
          </button>
          <button
            className="text-4xl bg-cyan-400/50 py-3 rounded-xl font-semibold text-cyan-200 border-2 border-cyan-200
    hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear flex items-center justify-center"
          >
            <IoIosSettings className="text-5xl mr-2" />
            GAME SETTING
          </button>
        </div>
      </div>
      <Canvas
        dpr={[1, 2]}
        style={{ height: "100%", width: "100%" }}
        shadows
        className="z-0"
      >
        <OrbitControls />

        <Suspense fallback={null}>
          <Physics debug={debug} gravity={[0, -9.81, 0]}>
            <Effects />
            {/* <Vignette eskil={false} offset={0.1} darkness={1.2} />
            <Pixelation granularity={5} /> */}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};

export default Home;
