import React, { useContext } from 'react'
import { GameContext } from '../../contexts/GameContext'

interface NextLevelButtonProps {
    currentLevel: number;
}

const NextLevelButton: React.FC<NextLevelButtonProps> = ({ currentLevel }) => {

    const { currentScene, setScene } = useContext(GameContext)

    const handleNextLevelClick = () => {
        if (setScene) {
            const nextScene = `game-level-${currentLevel + 1}`
            setScene(currentScene, nextScene)
        }
    }

    return (
        <div className='w-max px-4 py-2 rounded-md bg-cyan-400 '>
            <button onClick={handleNextLevelClick}>ถัดไป</button>
        </div>
    )
}

export default NextLevelButton