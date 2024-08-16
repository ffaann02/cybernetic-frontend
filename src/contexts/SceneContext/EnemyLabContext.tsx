import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import React, { createContext, useContext, useState } from "react";

// Define the shape of your context data
interface EnemyLabContextData {
    level: number;
    setLevel: (level: number) => void;
    weaknessLabels: { [key: string]: any[] };
    setWeaknessLabels: (weaknessLabels: { [key: string]: any[] }) => void;
    labelCounts: { [key: string]: number };
    setLabelCounts: (labelCounts: { [key: string]: number }) => void;
}

// Create the EnemyLabContext
const EnemyLabContext = createContext<EnemyLabContextData | undefined>(undefined);

// Create a custom hook to access the EnemyLabContext
export const useEnemyLabContext = () => {
    const context = useContext(EnemyLabContext);
    if (!context) {
        throw new Error(
            "useEnemyLabContext must be used within a EnemyLabContextProvider"
        );
    }
    return context;
};

// Create the EnemyLabContextProvider component
export const EnemyLabContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [level, setLevel] = useState<number>(1);
    const [weaknessLabels, setWeaknessLabels] = useState<{ [key: string]: any[] }>({});
    const [labelCounts, setLabelCounts] = useState<{ [key: string]: number }>({});

    const contextValue: EnemyLabContextData = {
        level,
        setLevel,
        weaknessLabels,
        setWeaknessLabels,
        labelCounts,
        setLabelCounts,
    };

    return (
        <EnemyLabContext.Provider value={contextValue}>
            {children}
        </EnemyLabContext.Provider>
    );
};