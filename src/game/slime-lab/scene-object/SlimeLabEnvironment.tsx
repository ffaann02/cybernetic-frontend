import React, { useContext, useState } from 'react'
import { SlimeLabMap } from '../map/slime-lab-map'
import { Environment, PerspectiveCamera, useKeyboardControls } from '@react-three/drei'
import EnemyPatrolController from '../../../controllers/EnemyPatrolController'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { Item } from '../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../utils'
import FakeGlowMaterial from '../../../components/FakeGlowMaterial'
import { GameContext } from '../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import { Controls } from '../../../controllers/CharacterController'
import SmoothCamera from '../../../controllers/SmoothCamera'
import EnemyModel from './EnemyModel'

type Props = {}

const SlimeLabEnvironment = ({
    enemyNameChoices,
    selectedEnemy,
}) => {

    const { currentHit, setCurrentHit, isUsingSecurityCamera, setIsUsingSecurityCamera, isInteracting, setIsInteracting } = useContext(GameContext);
    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const [lastPressTime, setLastPressTime] = useState(0);

    const handleComputerEnter = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("ComputerEnemyLab");
        }
    }

    const handleComputerExit = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("");
        }
    }

    const handleComputerTrainingEnter = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("ComputerTrainingEnemyLab");
        }
    }

    const handleComputerTrainingExit = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("");
        }
    }

    useFrame(() => {
        if (ePressed && currentHit === "ComputerEnemyLab") {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsUsingSecurityCamera((prev) => !prev);
            }
        }
        if (ePressed && currentHit === "ComputerTrainingEnemyLab") {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsInteracting((prev) => !prev);
            }
        }
    })

    return (
        <>
            <SlimeLabMap />
            <Environment preset="dawn" environmentIntensity={0.5} />
            <directionalLight
                intensity={4}
                scale={100}
                castShadow
                shadow-mapSize-height={4096 * 3}
                shadow-mapSize-width={4096 * 3}
                rotation={[0, 0, 0]}
                position={[-2, 8, 2]}
                shadow-camera-left={-20}
                shadow-camera-right={40}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            {isUsingSecurityCamera &&
                <SmoothCamera
                    targetPosition={[6, 5, -5.5]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(45),
                        degreeNumberToRadian(0),
                    ]} />
            }
            <EnemyModel
                enemyNameChoices={enemyNameChoices}
                selectedEnemy={selectedEnemy}
                enemyScale={1}
                position={[-1.6, 2.2, -7.81]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(45), degreeNumberToRadian(0)]}
            />
            <RigidBody
                lockTranslations
                lockRotations
                position={[-8, 15, -10]}
                scale={[100, 100, 150]}
                rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(0)]}>
                <Item
                    item={{
                        name: "PipeMedium",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        fileType: "glb",
                    }}
                />
                
            </RigidBody>
            <RigidBody
                colliders={false}
                lockTranslations
                lockRotations
                position={[-8, 3, -10]}
                scale={[20, 20, 20]}
                rotation={[degreeNumberToRadian(180), degreeNumberToRadian(0), degreeNumberToRadian(0)]}>
                <Item
                    item={{
                        name: "GlassJar",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        fileType: "glb",
                    }}    
                />
                <CylinderCollider args={[0.5, 0.15, 1]} />
                <mesh position={[0, 0, 0]} rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}>
                    <cylinderGeometry args={[0.4, 0.4, 15]} />
                    <FakeGlowMaterial
                        glowColor='#02eeff'
                        falloff={2}
                        glowInternalRadius={20}
                        opacity={0.1} />
                </mesh>
            </RigidBody>
            <RigidBody
                name='ComputerEnemyLab'
                colliders={false}
                lockTranslations
                lockRotations
                position={[-8, 0, -6]}
                scale={[400, 400, 400]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                onCollisionEnter={handleComputerEnter}
                onCollisionExit={handleComputerExit}>
                <CuboidCollider args={[0.003, 0.004, 0.009]} />
                <Item
                    item={{
                        name: "ComputerVideo",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        fileType: "glb",
                    }}
                    isOutlined={true}
                    outlineColor={"white"}
                    outlineThickness={5}
                />
            </RigidBody>
            <RigidBody
                name='ComputerTrainingEnemyLab'
                colliders={false}
                lockTranslations
                lockRotations
                position={[-16, 0, 8]}
                scale={[200, 200, 200]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(90), degreeNumberToRadian(0)]}
                onCollisionEnter={handleComputerTrainingEnter}
                onCollisionExit={handleComputerTrainingExit}>
                <CuboidCollider args={[0.003, 0.023, 0.007]} />
                <Item
                    item={{
                        name: "ScifiComputer",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        fileType: "glb",
                    }}
                    isOutlined={true}
                    outlineColor={"white"}
                    outlineThickness={5}
                />
            </RigidBody>
        </>
    )
}

export default SlimeLabEnvironment