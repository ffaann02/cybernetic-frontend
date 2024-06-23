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
}

const initialGameContext: GameContextProps = {
  currentScene: "welcome",
  speed: 7.5,
  debug: false,
  sceneList: ["home", "test","welcome"],
  camera: 1,
  cameraList: [1, 2, 3],
};

export const GameContext = createContext<GameContextProps>(initialGameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] =
    useState<GameContextProps>(initialGameContext);

  const value = {
    currentScene: gameState.currentScene,
    speed: gameState.speed,
    debug: gameState.debug,
    sceneList: gameState.sceneList,
    camera: gameState.camera,
    cameraList: gameState.cameraList,
    setGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
