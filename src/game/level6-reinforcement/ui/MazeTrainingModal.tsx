import React, { useEffect, useState } from 'react';
import { useLevel6Context } from '../../../contexts/SceneContext/Level6Context';

interface Props { }

const MazeTrainingModal: React.FC<Props> = ({

}) => {
    const {
        mazeSolverParameter,
        isTraining,
        trainingProgress,
        isDisplayTrainingModal,
        setIsDisplayTrainingModal,
        trainingCurrentEpisode,
        trainingReward,
    } = useLevel6Context();

    const totalEpisodes = mazeSolverParameter.episodes; // Example total episodes
    const episodesPerBar = 100; // Episodes per bar

    // Calculate number of bars needed
    const numberOfBars = Math.ceil(totalEpisodes / episodesPerBar);

    // Determine the index of the currently processing and completed bars
    const currentBarIndex = Math.floor(trainingCurrentEpisode / episodesPerBar);

    // Create an array to hold the progress of each bar
    const [bars, setBars] = useState<number[]>([]);

    // Effect to update bars state based on currentEpisode
    useEffect(() => {
        const numberOfActiveBars = Math.ceil(trainingCurrentEpisode / episodesPerBar);
        const newBars = Array(numberOfActiveBars).fill(0); // Initialize all bars as empty

        // Update completed bars
        for (let i = 0; i < currentBarIndex; i++) {
            newBars[i] = 100; // Fully completed
        }

        // Update the currently processing bar
        if (currentBarIndex < numberOfBars) {
            newBars[currentBarIndex] = Math.min(
                Math.max(((trainingCurrentEpisode % episodesPerBar) / episodesPerBar) * 100, 0),
                100
            );
        }

        setBars(newBars);
    }, [trainingCurrentEpisode, numberOfBars, episodesPerBar]);

    return (
        <>
            {(isTraining || isDisplayTrainingModal) && (
                <div className="absolute w-full h-full z-[100000] flex justify-center">
                    <div className="flex justify-center items-center max-w-7xl gap-x-4 relative">
                        <div
                            style={{ backdropFilter: 'blur(8px)' }}
                            className="min-w-[960px] max-w-6xl rounded-xl border-4 border-white shadow-md shadow-white bg-white/25"
                        >
                            <div className='flex justify-between'>
                                <h1 className="text-white text-center mt-4">
                                    Training Progress: {trainingProgress.toFixed(2)}%
                                </h1>
                                <button
                                    onClick={() => setIsDisplayTrainingModal(false)}
                                    className="text-white text-center mt-4 mr-4">
                                    Close
                                </button>
                            </div>
                            <div className="mt-4 space-y-2 px-8 pb-12">
                                {bars.map((progress, index) => (
                                    <div key={index} className='grid grid-cols-12 gap-4'>
                                        <div className='col-span-2'>
                                            <span>Episodes: {(index + 1) * episodesPerBar}</span>
                                        </div>
                                        <div className="relative col-span-8 w-full h-4 bg-gray-300 overflow-hidden">
                                            <div
                                                style={{ width: `${progress}%` }}
                                                className={`absolute top-0 left-0 h-full ${progress === 100 ? 'bg-blue-600' : 'bg-blue-300'} transition-all duration-300`}
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <span>Reward: {trainingReward[index]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MazeTrainingModal;
