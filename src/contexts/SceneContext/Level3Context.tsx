import React, { createContext, useContext } from "react";

// Define the shape of your context data
interface Level3ContextData {
  level: number;
  setLevel: (level: number) => void;
}

// Create the Level1Context
const Level3Context = createContext<Level3ContextData | undefined>(undefined);

// Create a custom hook to access the Level1Context
export const useLevel1Context = () => {
  const context = useContext(Level3Context);
  if (!context) {
    throw new Error(
      "useLevel1Context must be used within a Level1ContextProvider"
    );
  }
  return context;
};

// Create the Level1ContextProvider component
export const Level3ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = React.useState<number>(1);

  const contextValue: Level3ContextData = {
    level,
    setLevel,
  };

  return (
    <Level3Context.Provider value={contextValue}>
      {children}
    </Level3Context.Provider>
  );
};