import React, { useContext } from 'react'
import { useLevel5Context } from '../../../contexts/SceneContext/Level5Context'
import { GiPlanetConquest } from "react-icons/gi";
import { IoSettingsOutline } from 'react-icons/io5';
import { TiHomeOutline } from 'react-icons/ti';
import { VscDebugRestart } from 'react-icons/vsc';
import roboto from '../../../assets/assistant-bot/gif/Idle.gif'
import { GameContext } from '../../../contexts/GameContext';

type Props = {}

const EndGameUI: React.FC<Props> = () => {

    const { currentScene, setScene } = useContext(GameContext)
    const { bossItemWasPicked } = useLevel5Context()

    const handleBackToHome = () => {
        setScene(currentScene, "home");
        setIsPaused(false);
      };
    

    return (
        <>
            {bossItemWasPicked &&
                <div className="absolute z-[99999] w-full h-screen bg-black/70 mx-auto flex">
                    <div className="max-w-2xl w-full h-fit bg-cyan-400/50 m-auto border rounded-2xl pb-10">
                        <div className='flex justify-center mt-4'>
                            <GiPlanetConquest className='text-white text-7xl mb-2 mr-1' />
                            <p className='text-5xl font-bold text-white my-auto'>Congratulations</p>
                        </div>
                        <div className='flex justify-center'>
                            <p className='text-2xl font-bold text-yellow-400 my-auto'>Story mode complete. Unlock online mode.</p>
                        </div>
                        <div className="px-48 my-4">
                            <img src={roboto} />
                        </div>
                        {/* <div className="px-32 my-4">
                            <img src="/images/Logo_V1.png" />
                        </div> */}
                        <div className="px-10 grid grid-cols-3 mt-10 gap-x-4">
                            <div
                                className="px-3 py-3 bg-cyan-400/50 col-span-full w-full rounded-2xl flex text-center justify-center text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
                            onClick={handleBackToHome}
                            >
                                <TiHomeOutline className="text-5xl" />
                                <p className="text-2xl my-auto ml-3">Back To Home</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EndGameUI