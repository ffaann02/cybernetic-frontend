import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../../contexts/GameContext';

type Props = {}

const BossHologramUI = (props: Props) => {

    const { currentHit, isInteracting } = useContext(GameContext);
    const [currentTopic, setCurrentTopic] = useState<string>('Information');

    const [isDisplayAttack, setIsDisplayAttack] = useState(false);
    const [burstPoints, setBurstPoints] = useState<boolean[][]>([]);

    useEffect(() => {
        if (isDisplayAttack) {
            generateBurstPoints();
        }
    }, [isDisplayAttack]);

    const generateBurstPoints = () => {
        const newBurstPoints: boolean[][] = Array(6).fill(null).map(() => Array(10).fill(false));

        for (let col = 0; col < 10; col++) {
            let burstCount = 0;
            while (burstCount < 2) {
                const randomRow = Math.floor(Math.random() * 6);
                if (!newBurstPoints[randomRow][col]) {
                    newBurstPoints[randomRow][col] = true;
                    burstCount++;
                }
            }
        }

        setBurstPoints(newBurstPoints);
    };

    return (
        <>
            {currentHit === "BossHologramComputer" && isInteracting && (
                <div className='absolute w-full h-full z-[10000] flex justify-center '>
                    <div className='flex justify-center items-center max-w-4xl gap-x-4 relative'>
                        <div style={{ backdropFilter: 'blur(8px)' }} className='min-w-[960px] min-h-[560px] h-fit rounded-xl border-4 border-white shadow-lg shadow-white'>
                            <div className='text-white'>
                                <div className='bg-cyan-400/50 p-4'>
                                    <h1 className='text-center text-3xl font-bold'>Simulation Hologram</h1>
                                    <div className='flex pt-4 pl-2 gap-2'>
                                        <h2 className='text-center text-xl border rounded-md px-4 py-1'>Information</h2>
                                        <h2 className='text-center text-xl border rounded-md px-4 py-1'>Parameter</h2>
                                        <h2 className='text-center text-xl border rounded-md px-4 py-1' onClick={() => setCurrentTopic("Simulate Action")}>Simulate Action</h2>
                                    </div>
                                </div>
                                <div className='px-6 py-4'>
                                    {currentTopic === 'Simulate Action' &&
                                        <>
                                            <h3 className='text-xl'>Action State</h3>
                                            <div className='flex gap-2 text-lg text-center'>
                                                <div className='py-1 px-4 my-2 border rounded-md cursor-pointer hover:bg-cyan-400/40'>
                                                    <p>Idle</p>
                                                </div>
                                                <div className='py-1 px-4 my-2 border rounded-md cursor-pointer hover:bg-cyan-400/40'>
                                                    <p>Charging</p>
                                                </div>
                                                <div className={`py-1 px-4 my-2 border rounded-md cursor-pointer hover:bg-cyan-400/40 ${isDisplayAttack ? 'bg-cyan-400/60' : ''}`} onClick={() => setIsDisplayAttack((prev) => !prev)}>
                                                    <p>Attack</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {currentTopic === 'Simulate Action' && isDisplayAttack &&
                                        <div className='grid grid-cols-10 grid-rows-6 gap-1 p-1'>
                                            {burstPoints.flat().map((isBurst, index) => (
                                                <div
                                                    key={index}
                                                    className={`border border-gray-400 aspect-square ${isBurst ? 'bg-red-400' : 'bg-gray-300/90'
                                                        } hover:bg-cyan-400`}
                                                ></div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default BossHologramUI;