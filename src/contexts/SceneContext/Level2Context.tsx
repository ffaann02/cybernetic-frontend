import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Define the shape of your context data
interface Level2ContextData {
  level: number;
  setLevel: (level: number) => void;
  isOpenTrainComputer: boolean;
  setIsOpenTrainComputer: (isOpen: boolean) => void;
  isOpenGlassClassifier: boolean;
  setIsOpenGlassClassifier: (isOpen: boolean) => void;
  isActivateScanner: boolean;
  setIsActivateScanner: (isActivate: boolean) => void;
  currentComputerGlassTest: number;
  setCurrentComputerGlassTest: (test: number) => void;
  isOpenGlassTest: boolean;
  setIsOpenGlassTest: (isOpen: boolean) => void;
  resetTrigger: number;
  setResetTrigger: (trigger: number) => void;
  dangerPattern: number[];
  setDangerPattern: (pattern: number[]) => void;
  ufoActiveList: boolean[];
  setUfoActiveList: (list: boolean[]) => void;
  glassParameters: any[];
  setGlassParameters: (params: any[]) => void;
  dataCollectNotify: React.MutableRefObject<any>;
  level2PlayTime: number;
  setLevel2PlayTime: (time: number) => void;
  lastUpdateTimeRef: any;
}

// Create the Level1Context
const Level2Context = createContext<Level2ContextData | undefined>(undefined);

// Create a custom hook to access the Level1Context
export const useLevel2Context = () => {
  const context = useContext(Level2Context);
  if (!context) {
    throw new Error(
      "useLevel2Context must be used within a Level1ContextProvider"
    );
  }
  return context;
};

// Create the Level1ContextProvider component
export const Level2ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [isOpenTrainComputer, setIsOpenTrainComputer] = useState(false);
  const [isOpenGlassClassifier, setIsOpenGlassClassifier] = useState(false);
  const [isActivateScanner, setIsActivateScanner] = useState(false);
  const [currentComputerGlassTest, setCurrentComputerGlassTest] = useState(0);
  const [isOpenGlassTest, setIsOpenGlassTest] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [dangerPattern, setDangerPattern] = useState([2,2,2,1,2,2]);
  const [ufoActiveList, setUfoActiveList] = useState([false, false, false]);
  const [glassParameters, setGlassParameters] = useState([]);
  const dataCollectNotify = useRef(null);

  const [level2PlayTime, setLevel2PlayTime] = useState<number>(0);
  const lastUpdateTimeRef = useRef(Date.now());

  const contextValue: Level2ContextData = {
    level,
    setLevel,
    isOpenTrainComputer,
    setIsOpenTrainComputer,
    isOpenGlassClassifier,
    setIsOpenGlassClassifier,
    isActivateScanner,
    setIsActivateScanner,
    currentComputerGlassTest,
    setCurrentComputerGlassTest,
    isOpenGlassTest,
    setIsOpenGlassTest,
    resetTrigger,
    setResetTrigger,
    dangerPattern,
    setDangerPattern,
    ufoActiveList,
    setUfoActiveList,
    glassParameters,
    setGlassParameters,
    dataCollectNotify,
    level2PlayTime,
    setLevel2PlayTime,
    lastUpdateTimeRef,
  };

  return (
    <Level2Context.Provider value={contextValue}>
      {children}
    </Level2Context.Provider>
  );
};