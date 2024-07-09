import React, { useContext, useEffect } from 'react'
import FadeTransition from '../../components/scene-transition/FadeTransition'
import { GameContext } from '../../contexts/GameContext'
import { LevelContext } from '../../contexts/SceneContext/LevelContext'
import PreviousLevelButton from '../../components/game-level/PreviousLevelButton'

interface Level3Props { }

const Level3: React.FC<Level3Props> = () => {

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
        </>}
    </>
  )
}

export default Level3