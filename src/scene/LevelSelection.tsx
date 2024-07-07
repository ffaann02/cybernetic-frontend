import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import axiosInstance from '../api/axios';
import { GameContext } from '../contexts/GameContext';
import { LevelDetail } from '../contexts/SceneContext/LevelContext';
import { useAuth } from '../hooks/useAuth';

interface UserLevel {
    userId: string;
    levelPlayed: string[];
}

const LevelSelection: React.FC = () => {

    const { axiosFetch } = useAxios();
    const { user } = useAuth();
    const { currentScene, setScene } = useContext(GameContext)

    const [levels, setLevels] = useState<LevelDetail[]>([]);
    const [userLevels, setUserLevels] = useState<UserLevel>();

    const fetchLevels = async () => {
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'get',
                url: '/game-play/level-selection',
            });
            setLevels(response.gamePlayLevel);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserLevels = async () => {
        const userId = user?.userId;
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'get',
                url: '/user/game-play-level',
                requestConfig: {
                    params: { userId: userId },
                },
            });
            setUserLevels(response.userGamePlayLevel);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchLevels();
        fetchUserLevels();
    }, []);

    const navigateToLevel = (level: LevelDetail) => {
        console.log(level);
        if (setScene) {
            console.log(`game-level-${level.levelNumber}`);
            setScene(currentScene, `game-level-${level.levelNumber}`);
        }
    }

    const isLevelUnlocked = (levelNumber: number) => {
        if (levelNumber === 1) {
            return true; // Level 1 is always unlocked
        }
        if (!userLevels || userLevels.levelPlayed.length === 0) {
            return false; // No levels are played, so other levels are locked
        }
        const playedLevels = userLevels.levelPlayed.map(Number);
        return playedLevels.includes(levelNumber - 1);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white">
            <h1 className="text-4xl font-bold mb-8 text-cyan-600">Level Selection</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
                {levels.map(level => (
                    <button
                        key={level.id}
                        onClick={() => isLevelUnlocked(level.levelNumber) && navigateToLevel(level)}
                        className={`flex items-center justify-center w-16 h-16 rounded-lg shadow-lg 
                            ${level.isActive ?
                                (isLevelUnlocked(level.levelNumber)
                                    ? 'bg-cyan-500 hover:bg-cyan-600'
                                    : 'bg-gray-500 cursor-not-allowed') : 'bg-gray-500 cursor-not-allowed'}`}
                        disabled={!isLevelUnlocked(level.levelNumber)}
                    >
                        {level.isActive ? (
                            <span className="text-2xl font-bold">{level.levelNumber}</span>
                        ) : (
                            <span className="text-2xl font-bold">?</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LevelSelection;
