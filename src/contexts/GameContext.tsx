import React, { createContext, useState } from "react";

interface GameContextProps {
  currentScene: string;
  previousScene: string;
  speed: number;
  debug: boolean;
  setGameState?:
  | React.Dispatch<React.SetStateAction<GameContextProps>>
  | undefined;
  setScene?: (currentScene: string, nextScene: string) => void;
  sceneList: string[];
  camera: number;
  cameraList: number[];
  currentHit?: string;
  setCurrentHit?: React.Dispatch<React.SetStateAction<string>>;
  isCoding?: boolean;
  setIsCoding: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialGameContext: GameContextProps = {
  // currentScene: "tutorial",
  currentScene: "level-selection",
  previousScene: "level-selection",
  speed: 7.5,
  debug: true,
  sceneList: ["home", "tutorial", "test", "welcome", "level-selection", "game-level-1", "game-level-2", "game-level-3"],
  camera: 2,
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
  const setScene = (currentScene: string, nextScene: string) => {
    setGameState((prevState) => ({
      ...prevState,
      currentScene: nextScene,
      previousScene: currentScene,
    }));
  };

  const value = {
    currentScene: gameState.currentScene,
    previousScene: gameState.previousScene,
    speed: gameState.speed,
    debug: gameState.debug,
    sceneList: gameState.sceneList,
    camera: gameState.camera,
    cameraList: gameState.cameraList,
    setGameState,
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding,
    setScene,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
