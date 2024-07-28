import React, { useContext } from 'react'
import { GameContext } from '../../../contexts/GameContext'

type Props = {}

const TurretGunUI = (props: Props) => {

    const { currentHit, isUsingTurret, turretData } = useContext(GameContext);

    return (
        <>
            {currentHit && currentHit.includes('TurretGun') && isUsingTurret &&
                <div className='w-full h-full fixed z-[10000]'>
                    <div className='relative w-full h-full flex justify-center items-center'>
                        <div
                            id='circle-hole-active'
                            className="absolute flex justify-center items-center w-[640px] h-[640px] rounded-full border-[24px]"
                            style={{ borderColor: turretData.bulletColor === "green" ? "#00ff22" : turretData.bulletColor}}>
                            <div className='absolute w-[48px] h-[48px] rounded-full border-2'
                            style={{ backgroundColor: turretData.bulletColor === "green" ? "#00ff22" : turretData.bulletColor  }}>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default TurretGunUI