import React, { useContext } from 'react'
import { GameContext } from '../../../contexts/GameContext';

type Props = {}

const CameraMazeSolverUI = ({

}) => {

    const { currentHit, isInteracting, isUsingSecurityCamera, setIsUsingSecurityCamera } = useContext(GameContext);

    return (
        <>
            {currentHit === "ComputerMazeSolver" && isInteracting && isUsingSecurityCamera === true &&
                <div className='w-full h-full fixed z-[10000]'>
                    <div className='relative w-full h-full flex justify-center items-center'>
                    </div>
                </div>
            }
        </>
    )
}

export default CameraMazeSolverUI