import React, { useEffect, useState, Suspense, useContext } from "react";
import { ItemWithUrl } from "../game/shared-object/object/ItemWithUrl";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";
import { Carousel } from "primereact/carousel";
import { IoGameController } from "react-icons/io5";
import { Tag } from "primereact/tag";
import { GameContext } from "../contexts/GameContext";
import { MdExitToApp } from "react-icons/md";

export interface UserLevel {
  userId: string;
  levelPlayed: string[];
}

const levelTemplate = (
  level: any,
  selectedLevel: number,
  setSelectedLevel: (level: number) => void
) => {
  const isSelected = selectedLevel === level.level;
  return (
    <div
      className={`flex flex-col items-center justify-center h-[27rem] mx-4 pt-4 cursor-pointer`}
      onClick={() => setSelectedLevel(level.level)}
    >
      <div
        className={`w-full h-full bg-white rounded-xl ${
          isSelected
            ? "opacity-100 border-4 border-yellow-200"
            : "border-2 border-cyan-400"
        }
        relative flex flex-col opacity-50 hover:shadow-lg transition-all duration-200 ease-linear`}
      >
        <div className="z-10 bg-cyan-400/80 -mt-0.5 w-fit px-10 py-1 rounded-b-xl mx-auto">
          <p className="text-lg font-semibold text-white">
            Level {level.level}
          </p>
        </div>
        <img
          src={level.image}
          className="object-cover absolute z-0 h-full rounded-lg"
        />
        <div className="mt-auto mb-2 px-2 z-10">
          {level.tags.map((tag, index) => (
            <Tag key={index} severity="info" value={tag} className="mr-2"></Tag>
          ))}
        </div>
        <div className="bg-cyan-500/80 w-full bottom-0 px-10 py-2 rounded-b-lg mx-auto z-10">
          <p className="text-xl font-semibold text-slate-100 text-center">
            {level.name}
          </p>
        </div>
      </div>
    </div>
  );
};

const LevelSelectionNew: React.FC = () => {
  const backgroundTexture = useLoader(TextureLoader, "/images/sky.jpg");
  const { setScene } = useContext(GameContext);

  const levels = [
    {
      name: "Data Lab",
      image: "/images/level-cover/level1-cover.png",
      tags: ["Data Collection", "Data Cleaning"],
    },
    {
      name: "Classifier",
      image: "/images/level-cover/level2-cover.png",
      tags: ["ML Classification", "Model Training"],
    },
    {
      name: "Audio Lab",
      image: "/images/level-cover/level3-cover.png",
      tags: ["Audio Processing", "Signal Analysis"],
    },
    {
      name: "Secret Code",
      image: "/images/level-cover/level4-cover.png",
      tags: ["OCR", "Image Processing"],
    },
    {
      name: "Maze",
      image: "/images/level-cover/level5-cover.png",

      tags: ["Reinforcement Learning"],
    },
    {
      name: "Conqueror",
      image: "/images/level-cover/level6-cover.png",

      tags: ["Multi Modal", "Neural Network"],
    },
  ].map((level, index) => ({ ...level, level: index + 1 }));

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleStartGame = () => {
    if (selectedLevel) {
      console.log(`Start game at level ${selectedLevel}`);
      setScene("level-selection", `game-level-${selectedLevel}`);
    }
  };

  const handleBackToHome = () => {
    setScene("level-selection", "home");
  };

  return (
    <>
      <button
        onClick={handleBackToHome}
        className="absolute top-4 left-4 flex z-[9999] bg-cyan-400/50 p-2 border-2 border-cyan-200 
        rounded-lg hover:bg-cyan-200/50 gap-x-1 hover:gap-x-2 transition-all duration-200 ease-linear"
      >
        <MdExitToApp className="text-4xl text-cyan-200" />
        <p className="my-auto ml-2 text-2xl text-slate-200">Back to Home</p>
      </button>
      <div className="absolute w-full h-full px-20 py-32 z-50">
        <div className="w-full h-fit pb-4 bg-cyan-400/50 rounded-2xl border-2 border-cyan-200">
          <p
            className="text-5xl font-bold text-center mt-5 tracking-wider text-cyan-100"
            style={{
              textShadow: "2px 2px 0 black",
            }}
          >
            Select Level
          </p>
          <div className="h-full flex flex-col mt-4">
            <Carousel
              value={levels}
              numVisible={4}
              numScroll={1}
              className=""
              //   responsiveOptions={responsiveOptions}
              itemTemplate={(level) =>
                levelTemplate(level, selectedLevel, setSelectedLevel)
              }
            />
            <button
              onClick={handleStartGame}
              className="text-4xl mt-4 px-6 w-fit mx-auto bg-cyan-400/50 py-3 rounded-xl font-semibold text-cyan-200 border-2 border-cyan-200
    hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear flex items-center justify-center"
            >
              <IoGameController className="text-5xl mr-2" />
              START GAME
            </button>
          </div>
        </div>
      </div>
      <Canvas
        dpr={[1, 2]}
        style={{ height: "100%", width: "100%" }}
        shadows
        className="z-0"
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 4, 0]} intensity={0.2} />
        <Suspense fallback={null}>
          <mesh scale={[1.5, 1.5, 1.5]} position={[0, 0, -20]}>
            <planeGeometry attach="geometry" args={[50, 50]} />{" "}
            <meshBasicMaterial attach="material" map={backgroundTexture} />
          </mesh>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default LevelSelectionNew;
