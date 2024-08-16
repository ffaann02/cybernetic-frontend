import React, { createContext, useContext, useRef, useState } from "react";

// Define the shape of your context data
interface Level3ContextData {
  level: number;
  setLevel: (level: number) => void;
  isOpenAudioInput: boolean;
  setIsOpenAudioInput: (isOpenAudioInput: boolean) => void;
  isOpenVideoFootage: boolean;
  setIsOpenVideoFootage: (isOpenVideoFootage: boolean) => void;
  isPlayingSound: boolean;
  setIsPlayingSound: (isPlayingSound: boolean) => void;
  playTrigger: boolean;
  setPlayTrigger: (playTrigger: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  selectedAudioPath: string;
  setSelectedAudioPath: (selectedAudioPath: string) => void;
  isLooping: boolean;
  setIsLooping: (isLooping: boolean) => void;
  isOpenCD: boolean;
  setIsOpenCD: (isOpenCD: boolean) => void;
  isOpenTrainComputer: boolean;
  setIsOpenTrainComputer: (isOpenTrainComputer: boolean) => void;
  kaboom: boolean;
  setKaboom: (kaboom: boolean) => void;
  nextLevelDoor: boolean;
  setNextLevelDoor: (nextLevelDoor: boolean) => void;
  level3PlayTime: number;
  setLevel3PlayTime: (level3PlayTime: number) => void;
  lastUpdateTimeRef: any;
}

// Create the Level1Context
const Level3Context = createContext<Level3ContextData | undefined>(undefined);

// Create a custom hook to access the Level1Context
export const useLevel3Context = () => {
  const context = useContext(Level3Context);
  if (!context) {
    throw new Error(
      "useLevel3Context must be used within a Level3ContextProvider"
    );
  }
  return context;
};

// Create the Level1ContextProvider component
export const Level3ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [isOpenAudioInput, setIsOpenAudioInput] = useState(false);
  const [isOpenVideoFootage, setIsOpenVideoFootage] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(false);

  const [volume, setVolume] = useState(0.5);
  const [selectedAudioPath, setSelectedAudioPath] = useState("");
  const [isLooping, setIsLooping] = useState(false);

  const [isOpenCD, setIsOpenCD] = useState(false);
  const [isOpenTrainComputer, setIsOpenTrainComputer] = useState(false);
  const [kaboom, setKaboom] = useState(false);
  const [nextLevelDoor, setNextLevelDoor] = useState(false);

  const [level3PlayTime, setLevel3PlayTime] = useState<number>(0);
  const lastUpdateTimeRef = useRef(Date.now());

  const contextValue: Level3ContextData = {
    level,
    setLevel,
    isOpenAudioInput,
    setIsOpenAudioInput,
    isOpenVideoFootage,
    setIsOpenVideoFootage,
    isPlayingSound,
    setIsPlayingSound,
    playTrigger,
    setPlayTrigger,
    volume,
    setVolume,
    selectedAudioPath,
    setSelectedAudioPath,
    isLooping,
    setIsLooping,
    isOpenCD,
    setIsOpenCD,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    kaboom,
    setKaboom,
    nextLevelDoor,
    setNextLevelDoor,
    level3PlayTime,
    setLevel3PlayTime,
    lastUpdateTimeRef,
  };

  return (
    <Level3Context.Provider value={contextValue}>
      {children}
    </Level3Context.Provider>
  );
};