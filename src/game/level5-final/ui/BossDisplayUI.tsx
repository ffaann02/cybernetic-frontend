import React, { useContext, useEffect } from 'react'
import { ProgressBar } from 'primereact/progressbar';
import { GameContext } from '../../../contexts/GameContext';


const BossDisplayUI = ({
    bossChargingCountDown,
    bossActionState,
    bossHealth,
}) => {

    const { isPlayerInBossArea } = useContext(GameContext);

    // useEffect(() => {
    //     console.log(bossChargingCountDown)
    // }, [bossChargingCountDown])

    const reScaleToPercentage = (value) => {
        if (bossActionState === 'charging') {
            return (value / 5) * 100
        }
        else if (bossActionState === 'idle') {
            return 100
        }
    }

    return (
        <>
            {bossHealth > 0 &&
                <div className='w-full h-full fixed z-[10000]'>
                    <div className='relative'>
                        <div className='absolute top-16 flex justify-center w-[100%]'>
                            <div className={`w-[75%] mx-auto ${isPlayerInBossArea === true ? "opacity-100" : "opacity-0"} transition-opacity ease-linear duration-200`}>
                                <>
                                    <h1 className={`text-white text-2xl text-center mb-1`}>Phantom-X</h1>
                                    <div className='bg-[#ff8080] p-1'>
                                        <ProgressBar
                                            value={bossHealth}
                                            className='bg-black'
                                            color={"#ff004c"}
                                            showValue={false}
                                            style={{
                                                height: '40px',
                                                borderRadius: '0px',
                                            }} />
                                    </div>
                                    <div className='bg-[#ff8080] p-1'>
                                        <ProgressBar
                                            value={reScaleToPercentage(bossChargingCountDown)}
                                            className='bg-[#6b460e]'
                                            color={"#ff9f0e"}
                                            showValue={false}
                                            style={{
                                                height: '10px',
                                                borderRadius: '0px',
                                            }} />
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default BossDisplayUI