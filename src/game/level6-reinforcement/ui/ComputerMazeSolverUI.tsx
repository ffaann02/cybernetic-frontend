import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from '../../../contexts/GameContext'
import { useLevel6Context } from '../../../contexts/SceneContext/Level6Context';
import MazeParameterSlider from './MazeParameterSlider';

type Props = {}

const ComputerMazeSolverUI = ({
    trainMazeSolver,
    handleTrainMazeSolver,
}) => {

    const { currentHit, isInteracting, isUsingSecurityCamera, setIsUsingSecurityCamera } = useContext(GameContext);
    const { setIsMazeSolverStartMoving, mazeSolverParameter, setMazeSolverParameter } = useLevel6Context();

    const handleSimulate = () => {
        setIsUsingSecurityCamera(true)
        setTimeout(() => {
            setIsMazeSolverStartMoving(true);
        }, 1500);
    }

    const handleSlider = (property) => (e) => {
        const value = Number(e.target.value);
        setMazeSolverParameter({
            ...mazeSolverParameter,
            [property]: value
        })
    }

    return (
        <>
            {currentHit === "ComputerMazeSolver" && isInteracting && isUsingSecurityCamera === false &&
                <div className='absolute w-full h-full bg-black/25 z-[10000] flex justify-center'>
                    <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                        <div
                            style={{ backdropFilter: 'blur(8px)' }}
                            className='min-w-[1280px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-lg shadow-white overflow-y-scroll'>
                            <div className='bg-cyan-600 p-4 sticky top-0 z-50 text-white'>
                                <h1 className='text-center text-3xl font-bold'>Computer Maze Solver</h1>
                            </div>
                            <div className='bg-cyan-400/25 h-full'>
                                <div className='p-6'>
                                    <h2 className='text-xl text-white font-bold'>Parameter</h2>
                                    <MazeParameterSlider
                                        label="Episodes"
                                        value={mazeSolverParameter.episodes}
                                        minValue={100}
                                        maxValue={3000}
                                        step={100}
                                        onChange={handleSlider('episodes')}
                                        discription="Number of Episodes: How many training episodes the AI will run."
                                    />
                                    <MazeParameterSlider
                                        label="Alpha"
                                        value={mazeSolverParameter.alpha}
                                        minValue={0.1}
                                        maxValue={2}
                                        step={0.1}
                                        onChange={handleSlider('alpha')}
                                        discription="Alpha (Learning Rate): Determines how much new information overrides the old information."
                                    />
                                    <MazeParameterSlider
                                        label="Gamma"
                                        value={mazeSolverParameter.gamma}
                                        minValue={0.1}
                                        maxValue={3}
                                        step={0.1}
                                        onChange={handleSlider('gamma')}
                                        discription="Gamma (Discount Factor): Determines the importance of future rewards."
                                    />
                                    <MazeParameterSlider
                                        label="Epsilon"
                                        value={mazeSolverParameter.epsilon}
                                        minValue={0.1}
                                        maxValue={1}
                                        step={0.1}
                                        onChange={handleSlider('epsilon')}
                                        discription="Epsilon (Exploration Rate): Determines the probability of choosing a random action versus the best-known action."
                                    />
                                    <div className='w-full flex justify-end gap-4'>
                                        <button className='px-2 py-2 border rounded-md' onClick={handleSimulate}>
                                            <span className='text-white'>Simulate</span>
                                        </button>
                                        <button className='px-2 py-2 border rounded-md' onClick={handleTrainMazeSolver}>
                                            <span className='text-white'>Train</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ComputerMazeSolverUI