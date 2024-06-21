import React, { createContext, useState } from "react";

interface GameContextProps {
  currentScene: string;
  speed: number;
  debug: boolean;
  setGameState?:
    | React.Dispatch<React.SetStateAction<GameContextProps>>
    | undefined;
  sceneList: string[];
}

const initialGameContext: GameContextProps = {
  currentScene: "home",
  speed: 7.5,
  debug: false,
  sceneList: ["home","test"],
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
    setGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
