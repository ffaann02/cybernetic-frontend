import React, { createContext, useState } from "react";

interface GameContextProps {
  currentScene: string;
  speed: number;
  debug: boolean;
  setGameState?:
    | React.Dispatch<React.SetStateAction<GameContextProps>>
    | undefined;
  sceneList: string[];
  camera: number;
  cameraList: number[];
  currentHit?: string;
  setCurrentHit?: React.Dispatch<React.SetStateAction<string>>;
  isCoding?: boolean;
  setIsCoding: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialGameContext: GameContextProps = {
  currentScene: "tutorial",
  speed: 7.5,
  debug: true,
  sceneList: ["home","tutorial", "test","welcome"],
  camera: 1,
  cameraList: [1, 2, 3],
  currentHit: "",
  isCoding: false,
  setIsCoding: () => {},
};

export const GameContext = createContext<GameContextProps>(initialGameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] =
    useState<GameContextProps>(initialGameContext);

  const [currentHit, setCurrentHit] = useState<string>("");
  const [isCoding, setIsCoding] = useState<boolean>(false);

  const value = {
    currentScene: gameState.currentScene,
    speed: gameState.speed,
    debug: gameState.debug,
    sceneList: gameState.sceneList,
    camera: gameState.camera,
    cameraList: gameState.cameraList,
    setGameState,
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
