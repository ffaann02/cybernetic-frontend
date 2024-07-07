import React, { useContext, useEffect } from 'react'
import FadeTransition from '../../components/scene-transition/FadeTransition'
import NextLevelButton from '../../components/game-level/NextLevelButton'
import { GameContext } from '../../contexts/GameContext'
import { LevelContext } from '../../contexts/SceneContext/LevelContext'
import PreviousLevelButton from '../../components/game-level/PreviousLevelButton'

interface Level2Props { }

const Level2: React.FC<Level2Props> = () => {

  const { currentScene } = useContext(GameContext)
  const { levelDetails, fetchLevelDetailEachScence } = useContext(LevelContext);

  useEffect(() => {
    if (fetchLevelDetailEachScence) {
      fetchLevelDetailEachScence(currentScene)
    }
  }, [])

  return (
    <>
      <FadeTransition />
      {levelDetails &&
        <>
          <h1>Level{levelDetails.levelNumber}: {levelDetails.levelName}</h1>
          <PreviousLevelButton currentLevel={levelDetails.levelNumber} />
          <NextLevelButton currentLevel={levelDetails?.levelNumber} />
        </>}
    </>
  )
}

export default Level2