import React, { createContext, useRef, useState } from "react";

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
  currentCamera: number;
  cameraList: number[];
  currentHit?: string;
  setCurrentHit?: React.Dispatch<React.SetStateAction<string>>;
  isCoding?: boolean;
  isInteracting?: boolean;
  setIsCoding: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInteracting: React.Dispatch<React.SetStateAction<boolean>>;
  isChatting?: boolean;
  setIsChatting?: React.Dispatch<React.SetStateAction<boolean>>;
  isHidden?: boolean;
  setIsHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  isUsingSearch?: boolean;
  setIsUsingSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  isPlanting?: boolean;
  setIsPlanting?: React.Dispatch<React.SetStateAction<boolean>>;
  dataStorage?: any;
  setDataStorage?: React.Dispatch<React.SetStateAction<any>>;
  mines?: any;
  setMines?: React.Dispatch<React.SetStateAction<any>>;
  cooldowns?: any;
  setCooldowns?: React.Dispatch<React.SetStateAction<any>>;
  playerRigidBody?: React.RefObject<any>;
}

const initialGameContext: GameContextProps = {
  // currentScene: "tutorial",
  currentScene: "game-level-2",
  previousScene: "level-selection",
  speed: 7.5,
  debug: false,
  sceneList: [
    "home",
    "tutorial",
    "test",
    "welcome",
    "level-selection",
    "game-level-1",
    "game-level-2",
    "game-level-3",
  ],
  currentCamera: 1,
  cameraList: [1, 2, 3],
  currentHit: "",
  isCoding: false,
  isInteracting: false,
  setIsCoding: () => {},
  setIsInteracting: () => {},
  isChatting: false,
  setIsChatting: () => {},
  isHidden: false,
  setIsHidden: () => {},
  isUsingSearch: false,
  setIsUsingSearch: () => {},
  isPlanting: false,
  setIsPlanting: () => {},
  dataStorage: {},
  setDataStorage: () => {},
  mines: [],
  setMines: () => {},
  cooldowns: { J: 0, K: 0, L: 0 },
  setCooldowns: () => {},
};

export const GameContext = createContext<GameContextProps>(initialGameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] =
    useState<GameContextProps>(initialGameContext);
  const [currentHit, setCurrentHit] = useState<string>("");
  const [isCoding, setIsCoding] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isUsingSearch, setIsUsingSearch] = useState<boolean>(false);
  const [isPlanting, setIsPlanting] = useState<boolean>(false);
  const [dataStorage, setDataStorage] = useState<any>({});
  const [mines, setMines] = useState<any>([]);
  const [cooldowns, setCooldowns] = useState({ J: 0, K: 0, L: 0 });
  const playerRigidBody = useRef<any>(null);

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
    currentCamera: gameState.currentCamera,
    cameraList: gameState.cameraList,
    playerRigidBody,
    setGameState,
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding,
    isInteracting,
    setIsInteracting,
    setScene,
    isChatting,
    setIsChatting,
    isHidden,
    setIsHidden,
    isUsingSearch,
    setIsUsingSearch,
    isPlanting,
    setIsPlanting,
    dataStorage,
    setDataStorage,
    mines,
    setMines,
    cooldowns,
    setCooldowns,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
