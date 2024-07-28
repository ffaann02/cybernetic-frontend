import React, { useEffect } from 'react'
import { ProgressBar } from 'primereact/progressbar';


const BossDisplayUI = ({
    bossChargingCountDown,
    bossActionState,
}) => {

    // useEffect(() => {
    //     console.log(bossChargingCountDown)
    // }, [bossChargingCountDown])

    const reScaleToPercentage = (value) => {
        if(bossActionState === 'charging') {
            return (value / 5) * 100
        }
        else if(bossActionState === 'idle') {
            return 100
        }
    }

    return (
        <div className='w-full h-full fixed z-[10000]'>
            <div className='relative'>
                <div className='absolute top-16 flex justify-center w-[100%]'>
                    <div className={`w-[75%] mx-auto rounded-[4px] ${bossActionState === 'charging' ? "opacity-100" : "opacity-0"} transition-opacity ease-linear duration-200`}>
                            <>
                                <h1 className={`text-white text-2xl`}>Boss is about to attack !</h1>
                                <div className='bg-[#ff8080] p-1'>
                                    <ProgressBar
                                        value={reScaleToPercentage(bossChargingCountDown)}
                                        className='bg-black'
                                        color={"#ff004c"}
                                        showValue={false}
                                        style={{
                                            height: '40px',
                                            borderRadius: '4px',
                                        }} />
                                </div>
                            </>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BossDisplayUI