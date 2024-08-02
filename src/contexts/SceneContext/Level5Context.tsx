import React, { createContext, useContext } from "react";

// Define the shape of your context data
interface Level5ContextData {
    level: number;
    setLevel: (level: number) => void;
}

// Create the Level5Context
const Level5Context = createContext<Level5ContextData | undefined>(undefined);

// Create a custom hook to access the Level5Context
export const useLevel5Context = () => {
    const context = useContext(Level5Context);
    if (!context) {
        throw new Error(
            "useLevel5Context must be used within a Level5ContextProvider"
        );
    }
    return context;
};

// Create the Level5ContextProvider component
export const Level5ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [level, setLevel] = React.useState<number>(1);

    const contextValue: Level5ContextData = {
        level,
        setLevel,
    };

    return (
        <Level5Context.Provider value={contextValue}>
            {children}
        </Level5Context.Provider>
    );
};