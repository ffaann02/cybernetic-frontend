import React, { createContext, useContext } from "react";

// Define the shape of your context data
interface Level4ContextData {
  level: number;
  setLevel: (level: number) => void;
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
  const [level, setLevel] = React.useState<number>(1);

  const contextValue: Level4ContextData = {
    level,
    setLevel,
  };

  return (
    <Level4Context.Provider value={contextValue}>
      {children}
    </Level4Context.Provider>
  );
};