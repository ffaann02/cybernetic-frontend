import React, { useContext } from 'react'
import { GameContext } from '../../../contexts/GameContext'

type Props = {}

const Level5ModelChoosingUI = ({
  predictionModelChoices,
  BossAttackPatternPredictModel,
}) => {

  const { currentHit, isInteracting } = useContext(GameContext);

  return (
    <>
      {currentHit === "ComputerChooseModelLevel5" && isInteracting &&
        < div className='absolute w-full h-full z-[10000] flex justify-center'>
          <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
            <div
              style={{ backdropFilter: 'blur(8px)' }}
              className='min-w-[1280px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-lg shadow-white'>
              <div className='bg-cyan-600 p-4 sticky top-0 z-50'>
                <h1 className='text-center text-3xl font-bold text-white'>Choosing AI-Model</h1>
              </div>
            </div>
          </div>
        </div >
      }
    </>
  )
}

export default Level5ModelChoosingUI