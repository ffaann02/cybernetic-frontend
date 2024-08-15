import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import React, { createContext, useContext, useState } from "react";

// Define the shape of your context data
interface Level4ContextData {
  level: number;
  setLevel: (level: number) => void;
  isOpenOcrPassword: boolean; 
  setIsOpenOcrPassword: (isOpenOcrPassword: boolean) => void;
  isOpenCharacterStorage: boolean;
  setIsOpenCharacterStorage: (isOpenCharacterStorage: boolean) => void;
  isOpenTrainComputer: boolean;
  setIsOpenTrainComputer: (isOpenTrainComputer: boolean) => void;
  isPass: boolean;
  setIsPass: (isPass: boolean) => void;
  labelCounts: {
    "Character 1": number;
    "Character 2": number;
    "Character 3": number;
    "Character 4": number;
    "Character 5": number;
    "Character 6": number;
  };
  setLabelCounts: (labelCounts: {}) => void;
}

// Create the Level4Context
const Level4Context = createContext<Level4ContextData | undefined>(undefined);

// Create a custom hook to access the Level4Context
export const useLevel4Context = () => {
  const context = useContext(Level4Context);
  if (!context) {
    throw new Error(
      "useLevel4Context must be used within a Level4ContextProvider"
    );
  }
  return context;
};

// Create the Level4ContextProvider component
export const Level4ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [isOpenOcrPassword, setIsOpenOcrPassword] = useState<boolean>(false);
  const [isOpenCharacterStorage, setIsOpenCharacterStorage] = useState<boolean>(false);
  const [isOpenTrainComputer, setIsOpenTrainComputer] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [labelCounts, setLabelCounts] = useState({
    "Character 1": 0,
    "Character 2": 0,
    "Character 3": 0,
    "Character 4": 0,
    "Character 5": 0,
    "Character 6": 0,
  });

  const contextValue: Level4ContextData = {
    level,
    setLevel,
    isOpenOcrPassword,
    setIsOpenOcrPassword,
    isOpenCharacterStorage,
    setIsOpenCharacterStorage,
    isPass,
    setIsPass,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    labelCounts,
    setLabelCounts,
  };

  return (
    <Level4Context.Provider value={contextValue}>
      {children}
    </Level4Context.Provider>
  );
};