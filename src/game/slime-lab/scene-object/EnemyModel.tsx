import React, { useContext, useEffect, useState } from 'react'
import Enemy2D from '../../../animation/Enemy2D'
import { useEnemyAnimation } from '../../../hooks/useEnemyAnimation'
import { RigidBody } from '@react-three/rapier'
import { GameContext } from '../../../contexts/GameContext'

type Props = {}

const EnemyModel = ({
    enemyNameChoices,
    selectedEnemy,
    position,
    rotation,
}) => {

    const { isUsingSecurityCamera } = useContext(GameContext);
    const { animationState } = useEnemyAnimation();
    const [enemyScale, setEnemyScale] = useState(1);

    const uniqueEnemyScale = [
        { name: "Slime", scale: 0.5 },
        { name: "Spider", scale: 0.5 },
        { name: "Golem", scale: 0.52 },
    ]

    useEffect(() => {
        setEnemyScale(uniqueEnemyScale.find((item) => item.name === selectedEnemy.name)?.scale || 1);
    }, [selectedEnemy])

    return (
        <>
            <RigidBody
                lockTranslations
                lockRotations
                position={position}
                rotation={rotation}>
                {enemyNameChoices.includes(selectedEnemy.name) &&
                    <Enemy2D
                        name={selectedEnemy.name}
                        animation={animationState}
                        direction={"right"}
                        color={selectedEnemy.color}
                        scale={enemyScale}
                        opacityOptional={isUsingSecurityCamera ? 1.5 : 0} />
                }
            </RigidBody>
        </>
    )
}

export default EnemyModel