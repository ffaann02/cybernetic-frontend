import React, { useContext, useEffect, useRef, useState } from 'react'
import { Level5FinalRoom2Map } from '../../map/Level5-Final-Room2-Map'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Item } from '../../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../../utils'
import BossHologram from './BossHologram'
import { GameContext } from '../../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'

const Level5Room2Environment = ({

}) => {

    const { currentHit, setCurrentHit, setIsInteracting } = useContext(GameContext);
    const [lastPressTime, setLastPressTime] = useState(0);
    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const bossHoloGramRef = useRef<any>(null);

    useFrame(() => {
        if (ePressed && currentHit === "BossHologramComputer") {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsInteracting((prev) => !prev);
            }
        }
    })

    const handleBossHologramComputerColliderEnter = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("BossHologramComputer");
        }
    }

    const handleBossHologramComputerColliderExit = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("");
        }
    }

    return (
        <>
            <Level5FinalRoom2Map />
            <RigidBody
                name='BossHologramComputer'
                colliders={false}
                type='fixed'
                lockTranslations
                lockRotations
                scale={[200, 200, 200]}
                position={[-7, 0, 6]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                onCollisionEnter={handleBossHologramComputerColliderEnter}
                onCollisionExit={handleBossHologramComputerColliderExit}>
                <CuboidCollider args={[0.005, 0.024, 0.006]} />
                <Item
                    item={
                        {
                            name: "ScifiComputer",
                            position: [0, 0, 0],
                            scale: [1, 1, 1],
                            rotation: [0, 0, 0],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineThickness={7}
                />
            </RigidBody>
            <BossHologram bossHoloGramRef={bossHoloGramRef} />
        </>
    )
}

export default Level5Room2Environment