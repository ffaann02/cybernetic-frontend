import React, { useContext, useEffect, useState } from 'react'
import { GameContext } from '../../../contexts/GameContext'

type Props = {}

const DropdownComponent = ({ label, value, options, onChange }) => (
  <div className='grid grid-cols-4 py-2 ml-1'>
    <div className='col-span-2 my-auto'>
      <p className='my-auto font-medium'>{label}: </p>
    </div>
    <div className='col-span-2 w-[100%]'>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-700 text-white p-2 rounded w-full">
        {options.map((item, index) => (
          <option key={index} value={item.value}>{item.name}</option>
        ))}
      </select>
    </div>
  </div>
);

const Level5ModelChoosingUI = ({
  predictionModelChoices,
  BossAttackPatternPredictModel,
  setBossAttackPatternPredictModel,
  predictionStat,
}) => {

  const { currentHit, isInteracting, setIsInteracting } = useContext(GameContext);
  const [currentPredictionStat, setCurrentPredictionStat] = useState();
  const [tempBossAttackPatternPredictModel, setTempBossAttackPatternPredictModel] = useState(BossAttackPatternPredictModel);

  useEffect(() => {
    setCurrentPredictionStat(predictionStat.find((item) => item.name === tempBossAttackPatternPredictModel.name))
  }, [tempBossAttackPatternPredictModel, isInteracting]);

  const handleModelChange = (e) => {
    const selectedModel = predictionModelChoices.find((item) => item.value === e.target.value);
    if (selectedModel) {
      setTempBossAttackPatternPredictModel({
        name: selectedModel.name,
        value: selectedModel.value,
      })
    }
  };

  const handleConfirm = () => {
    setBossAttackPatternPredictModel(tempBossAttackPatternPredictModel);
    setIsInteracting(false);
  }

  const CalculateAccuracy = () => {
    return ((currentPredictionStat?.predict.correct / (currentPredictionStat?.predict.correct + currentPredictionStat?.predict.wrong)) * 100).toFixed(2);
  }

  return (
    <>
      {currentHit === "ComputerChooseModelLevel5" && isInteracting &&
        < div className='absolute w-full h-full z-[10000] flex justify-center'>
          <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
            <div
              style={{ backdropFilter: 'blur(8px)' }}
              className='min-w-[960px] max-w-6xl h-[60vh] rounded-xl  bg-black/25 border-4 border-white shadow-md shadow-white'>
              <div className='bg-cyan-400/80 p-4 sticky top-0 z-50'>
                <h1 className='text-center text-3xl font-bold text-white'>Choosing AI-Model</h1>
              </div>
              <div className='p-6 text-white'>
                <DropdownComponent
                  label="Prediction Model"
                  value={tempBossAttackPatternPredictModel.value}
                  options={predictionModelChoices}
                  onChange={handleModelChange}
                />
                <div className=' text-white bg-black/40 border rounded-md p-3 mt-4'>
                  <p className='ml-1 text-lg font-medium text-cyan-400'>{`Prediction Stat: ${tempBossAttackPatternPredictModel.name} `}</p>
                  {currentPredictionStat.predict.correct > 0 || currentPredictionStat.predict.wrong > 0
                    ?
                    <>
                      <p className='ml-1'>Correct: {currentPredictionStat?.predict.correct}</p>
                      <p className='ml-1'>Wrong: {currentPredictionStat?.predict.wrong}</p>
                      <p className='ml-1'>Accuray: {CalculateAccuracy()}%</p>
                    </>
                    :
                    <>
                      <p className='ml-1 mt-2 text-slate-400'>You not use this model to figth boss yet. Let's go fight it!</p>
                    </>
                  }

                </div>
              </div>
              <div className='w-full px-6 gap-3 flex justify-end h-min'>
                <div className='flex justify-end'>
                  <button className='border rounded-md p-2 text-white hover:border-red-400/80 hover:text-red-400 w-20'
                    onClick={() => setIsInteracting(false)}>
                    <span className=''>Cancle</span>
                  </button>
                </div>
                <div className='flex justify-end'>
                  <button className='border rounded-md p-2 bg-cyan-400/60 hover:bg-cyan-400/40 w-20'
                    onClick={handleConfirm}>
                    <span className='text-white'>Confirm</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div >
      }
    </>
  )
}

export default Level5ModelChoosingUI