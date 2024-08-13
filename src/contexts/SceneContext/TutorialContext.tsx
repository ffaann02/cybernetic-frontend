import React, { createContext, useContext, useRef, useState } from "react";

// Define the shape of your context data
interface TutorialContextData {
  level: number;
  setLevel: (level: number) => void;
  hitCheckpoints: number;
  setHitCheckpoints: (hitCheckpoints: number) => void;
  isOpenDialog: boolean;
  setIsOpenDialog: (isOpenDialog: boolean) => void;
  tutorialStep: number;
  setTutorialStep: (tutorialStep: number) => void;
  isOk: boolean;
  setIsOk: (isOk: boolean) => void;
  toastRef: React.RefObject<any>;
}

// Create the TutorialContext
const TutorialContext = createContext<TutorialContextData | undefined>(
  undefined
);

// Create a custom hook to access the TutorialContext
export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error(
      "useTutorialContext must be used within a TutorialContextProvider"
    );
  }
  return context;
};

// Create the TutorialContextProvider component
export const TutorialContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [hitCheckpoints, setHitCheckpoints] = useState<number>(0);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [isOk, setIsOk] = useState<boolean>(false);
  const toastRef = useRef(null);

  const contextValue: TutorialContextData = {
    level,
    setLevel,
    hitCheckpoints,
    setHitCheckpoints,
    isOpenDialog,
    setIsOpenDialog,
    tutorialStep,
    setTutorialStep,
    isOk,
    setIsOk,
    toastRef,
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
};
