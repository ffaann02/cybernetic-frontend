import React, { useContext } from 'react'
import { GameContext } from '../../contexts/GameContext'

interface PreviousLevelButtonProps {
    currentLevel: number;
}

const PreviousLevelButton: React.FC<PreviousLevelButtonProps> = ({ currentLevel }) => {

    const { currentScene, setScene } = useContext(GameContext)

    const handlePreviousLevelClick = () => {
        if (setScene) {
            const nextScene = `game-level-${currentLevel - 1}`
            setScene(currentScene, nextScene)
        }
    }

    return (
        <div className='w-max px-4 py-2 rounded-md bg-cyan-400 '>
            <button onClick={handlePreviousLevelClick}>ก่อนหน้า</button>
        </div>
    )
}

export default PreviousLevelButton