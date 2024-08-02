import React, { createContext, useContext } from "react";

// Define the shape of your context data
interface Level2ContextData {
  level: number;
  setLevel: (level: number) => void;
}

// Create the Level1Context
const Level2Context = createContext<Level2ContextData | undefined>(undefined);

// Create a custom hook to access the Level1Context
export const useLevel1Context = () => {
  const context = useContext(Level2Context);
  if (!context) {
    throw new Error(
      "useLevel1Context must be used within a Level1ContextProvider"
    );
  }
  return context;
};

// Create the Level1ContextProvider component
export const Level2ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = React.useState<number>(1);

  const contextValue: Level2ContextData = {
    level,
    setLevel,
  };

  return (
    <Level2Context.Provider value={contextValue}>
      {children}
    </Level2Context.Provider>
  );
};