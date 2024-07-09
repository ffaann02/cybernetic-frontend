import React, { useContext, useEffect } from 'react'
import FadeTransition from '../../components/scene-transition/FadeTransition'
import NextLevelButton from '../../components/game-level/NextLevelButton'
import { LevelContext } from '../../contexts/SceneContext/LevelContext'
import { GameContext } from '../../contexts/GameContext'
import BackToLevelSelection from '../../components/game-level/BackToLevelSelection'
import useUserLevel from '../../hooks/useUserLevel'

interface Level1Props { }

const Level1: React.FC<Level1Props> = () => {

  const { currentScene } = useContext(GameContext)
  const { levelDetails, fetchLevelDetailEachScence } = useContext(LevelContext);
  const { updateUserLevel } = useUserLevel();

  useEffect(() => {
    if (fetchLevelDetailEachScence) {
      fetchLevelDetailEachScence(currentScene)
    }
  }, [])

  const handleFinishLevel = async () => {
    try {
      if (levelDetails) {
        await updateUserLevel(levelDetails?.levelNumber);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <FadeTransition />
      {levelDetails &&
        <>
          <h1>Level{levelDetails.levelNumber}: {levelDetails.levelName}</h1>
          <div className='w-max px-4 py-2 rounded-md bg-cyan-400 '>
            <button onClick={() => handleFinishLevel()}>Finish Level</button>
          </div>
          <BackToLevelSelection />
          <NextLevelButton currentLevel={levelDetails?.levelNumber} />
        </>}
    </>
  )
}

export default Level1