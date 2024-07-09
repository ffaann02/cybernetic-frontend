import React, { useContext } from 'react'
import { GameContext } from '../../contexts/GameContext'

interface BackToLevelSelectionProps { }

const BackToLevelSelection: React.FC<BackToLevelSelectionProps> = () => {

    const { currentScene, setScene } = useContext(GameContext)

    const handleClick = () => {
        if (setScene) {
            setScene(currentScene, 'level-selection')
        }
    }

    return (
        <>
            <div className='w-max px-4 py-2 rounded-md bg-cyan-400 '>
                <button onClick={handleClick}>กลับไปหน้าเลือกด่าน</button>
            </div>
        </>
    )
}

export default BackToLevelSelection