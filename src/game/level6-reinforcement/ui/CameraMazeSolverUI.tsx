import React, { useContext } from 'react'
import { GameContext } from '../../../contexts/GameContext';
import { useLevel6Context } from '../../../contexts/SceneContext/Level6Context';

type Props = {}

const CameraMazeSolverUI = ({

}) => {

    const { currentHit, isInteracting, isUsingSecurityCamera } = useContext(GameContext);
    const { solvingTime } = useLevel6Context();

    return (
        <>
            {currentHit === "ComputerMazeSolver" && isInteracting && isUsingSecurityCamera === true &&
                <div className='w-full h-full fixed z-[10000]'>
                    <div className='relative w-full h-full m-8'>
                        <div className='w-full h-full flex justify-left items-left m-'>
                            <div className='text-lg font-medium text-white'>Solve Timing:</div>
                            <div className='text-2xl ml-3 font-bold text-white'>{solvingTime.toFixed(2)}</div>
                            <div className='text-2xl ml-2 font-bold text-white'>seconds</div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CameraMazeSolverUI