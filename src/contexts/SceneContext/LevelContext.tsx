import React, { createContext, useState } from "react";
import useAxios from "../../hooks/useAxios";
import axiosInstance from '../../api/axios';

export interface LevelDetail {
    id: string;
    levelNumber: number;
    levelName: string;
    description: string;
    isActive: boolean;
}

interface LevelContextProps {
    levelDetails?: LevelDetail;
    setLevelDetails?: React.Dispatch<React.SetStateAction<LevelDetail | undefined>>;
    fetchLevelDetailEachScence?: (currentScene: string) => void;
}

export const LevelContext = createContext<LevelContextProps>({});

export const LevelProvider = ({ children }: { children: React.ReactNode }) => {

    const { axiosFetch } = useAxios();

    const [levelDetails, setLevelDetails] = useState<LevelDetail>();

    const fetchLevelDetailEachScence = async (currentScene: string) => {
        const levelNumber = parseInt(currentScene.split('-')[2]);
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'get',
                url: '/game-play/level-selection/get-one',
                requestConfig: {
                    params: { levelNumber: levelNumber },
                },
            });
            setLevelDetails(response.gamePlayLevel);
        } catch (error) {
            console.error(error);
        }
    }

    const value = {
        levelDetails: levelDetails,
        setLevelDetails,
        fetchLevelDetailEachScence,
    };

    return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}