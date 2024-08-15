import React from 'react'
import { useLevel5Context } from '../../../contexts/SceneContext/Level5Context'

type Props = {}

const EndGameUI: React.FC<Props> = () => {

    const { bossItemWasPicked } = useLevel5Context()

    return (
        <>
            {bossItemWasPicked &&
                <div className="absolute z-[99999] w-full h-screen bg-black/70 mx-auto flex">
                    <div className="max-w-2xl w-full h-fit bg-cyan-400/50 m-auto border rounded-2xl pb-10">
                        <div className="px-20 mt-6">
                            <img src="/images/Logo_V1.png" />
                        </div>
                        <div className=''>
                            <p className='text-xl'>End Game!</p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EndGameUI