import React, { createContext, useContext, useState } from "react";

interface ModelStat {
    name: string;
    predict: {
        correct: number;
        wrong: number;
    };
}

// Define the shape of your context data
interface Level5ContextData {
    level: number;
    setLevel: (level: number) => void;
    bossActionState: string;
    setBossActionState: (bossActionState: string) => void;
    bossChargingCountDown: number;
    setBossChargingCountDown: (bossChargingCountDown: number) => void;
    bossHealth: number;
    setBossHealth: (bossHealth: number) => void;
    bossActionDuration: {
        idle: number;
        charging: number[];
        burst: number;
    };
    collectedBossData: any;
    setCollectedBossData: (collectedBossData: any) => void;
    predictionModelChoices: { name: string; value: string }[];
    BossAttackPatternPredictModel: { name: string; value: string };
    setBossAttackPatternPredictModel: (BossAttackPatternPredictModel: { name: string; value: string }) => void;
    predictionStat: ModelStat[];
    setPredictionStat: (predictionStat: ModelStat[]) => void;
    isDisplayTrainingModal: boolean;
    setIsDisplayTrainingModal: (isDisplayTrainingModal: boolean) => void;
    trainningResponse: any;
    setTrainningResponse: (trainningResponse: any) => void;
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
    const [bossActionState, setBossActionState] = useState('idle');
    const [bossChargingCountDown, setBossChargingCountDown] = useState(0);
    const [bossHealth, setBossHealth] = useState(100);
    const bossActionDuration = {
        idle: 1,
        charging: [2, 3, 4, 5],
        burst: 3,
    }
    const [collectedBossData, setCollectedBossData] = useState<any>([]);
    const predictionModelChoices = [
        { name: "v1", value: "level-5-boss-predict-model-v1" },
        { name: "v2", value: "level-5-boss-predict-model-v2" },
        { name: "v3", value: "level-5-boss-predict-model-v3" },
    ];
    const [BossAttackPatternPredictModel, setBossAttackPatternPredictModel] = useState<{ name: string, value: string }>({
        name: "v1",
        value: "level-5-boss-predict-model-v1",
    });
    const [predictionStat, setPredictionStat] = useState<any>([
        {
            name: "v1",
            predict: {
                correct: 0,
                wrong: 0,
            }
        },
        {
            name: "v2",
            predict: {
                correct: 0,
                wrong: 0,
            }
        },
        {
            name: "v3",
            predict: {
                correct: 0,
                wrong: 0,
            }
        }
    ]);
    const [isDisplayTrainingModal, setIsDisplayTrainingModal] = useState(false);
    const [trainningResponse, setTrainningResponse] = useState(null);

    const contextValue: Level5ContextData = {
        level,
        setLevel,
        bossActionState,
        setBossActionState,
        bossChargingCountDown,
        setBossChargingCountDown,
        bossHealth,
        setBossHealth,
        bossActionDuration,
        collectedBossData,
        setCollectedBossData,
        predictionModelChoices,
        BossAttackPatternPredictModel,
        setBossAttackPatternPredictModel,
        predictionStat,
        setPredictionStat,
        isDisplayTrainingModal,
        setIsDisplayTrainingModal,
        trainningResponse,
        setTrainningResponse,
    };

    return (
        <Level5Context.Provider value={contextValue}>
            {children}
        </Level5Context.Provider>
    );
};