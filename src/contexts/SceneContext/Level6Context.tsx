import React, { createContext, useContext } from "react";

// Define the shape of your context data
interface Level6ContextData {
    level: number;
    setLevel: (level: number) => void;
    mazeGeneratedPattern: any;
    setMazeGeneratedPattern: (mazeGeneratedPattern: any) => void;
    mazeStateDetail: any;
    setMazeStateDetail: (mazeStateDetail: any) => void;
    isMazeSolverStartMoving: boolean;
    setIsMazeSolverStartMoving: (isMazeSolverStartMoving: boolean) => void;
    isMazeSolverReachEnd: boolean;
    setIsMazeSolverReachEnd: (isMazeSolverReachEnd: boolean) => void;
    mazeSolverParameter: { episodes: number, alpha: number, gamma: number, epsilon: number };
    setMazeSolverParameter: (mazeSolverParameter: { episodes: number, alpha: number, gamma: number, epsilon: number }) => void;
    trainingProgress: number;
    setTrainingProgress: (trainingProgress: number) => void;
    isTraining: boolean;
    setIsTraining: (isTraining: boolean) => void;
    isDisplayTrainingModal: boolean;
    setIsDisplayTrainingModal: (isDisplayTrainingModal: boolean) => void;
    trainingCurrentEpisode: number;
    setTrainingCurrentEpisode: (trainingCurrentEpisode: number) => void;
    trainingReward: number[];
    setTrainingReward: (trainingReward: number[]) => void;
    solvingTime: number;
    setSolvingTime: (solvingTime: number) => void;
    mazeWallReDissolve: boolean;
    setMazeWallReDissolve: (mazeWallReDissolve: boolean) => void;
    plotImageBase64: string;
    setPlotImageBase64: (plotImageBase64: string) => void;
}

// Create the Level6Context
const Level6Context = createContext<Level6ContextData | undefined>(undefined);

// Create a custom hook to access the Level6Context
export const useLevel6Context = () => {
    const context = useContext(Level6Context);
    if (!context) {
        throw new Error(
            "useLevel6Context must be used within a Level6ContextProvider"
        );
    }
    return context;
};

// Create the Level6ContextProvider component
export const Level6ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [level, setLevel] = React.useState<number>(1);
    const [mazeGeneratedPattern, setMazeGeneratedPattern] = React.useState<any>(null);
    const [mazeStateDetail, setMazeStateDetail] = React.useState<any>(null);
    const [isMazeSolverStartMoving, setIsMazeSolverStartMoving] = React.useState<boolean>(false);
    const [isMazeSolverReachEnd, setIsMazeSolverReachEnd] = React.useState<boolean>(false);
    const [mazeSolverParameter, setMazeSolverParameter] = React.useState<{ episodes: number, alpha: number, gamma: number, epsilon: number }>({
        episodes: 1000,
        alpha: 0.1,
        gamma: 0.9,
        epsilon: 0.1,
    });
    const [trainingProgress, setTrainingProgress] = React.useState<number>(0);
    const [isTraining, setIsTraining] = React.useState<boolean>(false);
    const [isDisplayTrainingModal, setIsDisplayTrainingModal] = React.useState<boolean>(false);
    const [trainingCurrentEpisode, setTrainingCurrentEpisode] = React.useState<number>(0);
    const [trainingReward, setTrainingReward] = React.useState<number[]>([]);
    const [solvingTime, setSolvingTime] = React.useState<number>(0);
    const [mazeWallReDissolve, setMazeWallReDissolve] = React.useState<boolean>(true);
    const [plotImageBase64, setPlotImageBase64] = React.useState<string>('');

    const contextValue: Level6ContextData = {
        level,
        setLevel,
        mazeGeneratedPattern,
        setMazeGeneratedPattern,
        mazeStateDetail,
        setMazeStateDetail,
        isMazeSolverStartMoving,
        setIsMazeSolverStartMoving,
        isMazeSolverReachEnd,
        setIsMazeSolverReachEnd,
        mazeSolverParameter,
        setMazeSolverParameter,
        trainingProgress,
        setTrainingProgress,
        isTraining,
        setIsTraining,
        isDisplayTrainingModal,
        setIsDisplayTrainingModal,
        trainingCurrentEpisode,
        setTrainingCurrentEpisode,
        trainingReward,
        setTrainingReward,
        solvingTime,
        setSolvingTime,
        mazeWallReDissolve,
        setMazeWallReDissolve,
        plotImageBase64,
        setPlotImageBase64,
    };

    return (
        <Level6Context.Provider value={contextValue}>
            {children}
        </Level6Context.Provider>
    );
};