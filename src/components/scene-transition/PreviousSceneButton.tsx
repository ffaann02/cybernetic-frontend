import React, { useContext } from 'react'
import { GameContext } from '../../contexts/GameContext'

interface PreviousSceneButtonProps { }

const PreviousSceneButton: React.FC<PreviousSceneButtonProps> = () => {

    const { currentScene, previousScene, setScene } = useContext(GameContext)

    const handleBackToPreviousScene = () => {
        if (setScene) {
            setScene(currentScene, previousScene)
        }
    }

    return (
        <>
            <div className='w-max px-4 py-2 rounded-md bg-cyan-400 '>
                <button onClick={handleBackToPreviousScene}>ย้อนกลับ</button>
            </div>
        </>
    )
}

export default PreviousSceneButton