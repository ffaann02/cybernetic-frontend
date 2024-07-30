import React, { useContext, useRef, useState } from 'react'
import BossController from '../../../../controllers/BossController'
import { Level5FinalRoom1Map } from '../../map/Level5-Final-Room1-Map'
import { CuboidCollider, RigidBody, vec3 } from '@react-three/rapier'
import { degreeNumberToRadian } from '../../../../utils'
import { Item } from '../../../shared-object/object/Item'
import { GameContext } from '../../../../contexts/GameContext'
import { useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'
import { useFrame } from '@react-three/fiber'
import TurretGunControl from './TurretGunControl'
import DoorToBossFight from './DoorToBossFight'

type Props = {}

const Level5Room1Environment = ({
    bossActionDuration,
    setBossChargingCountDown,
    setBossActionState,
    bossHealth,
    setBossHealth,
    BossAttackPatternPredictModel,
    setPredictionStat,
}) => {

    const { playerRigidBody, currentHit, setCurrentHit, isUsingTurret, setIsUsingTurret, isPlayerInBossArea, setIsPlayerInBossArea, setIsInteracting } = useContext(GameContext);
    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const [lastPressTime, setLastPressTime] = useState(0);

    const leftDoorToBossFightRef = useRef<any>(null);
    const rightDoorToBossFightRef = useRef<any>(null);
    const [isDoorOpening, setIsDoorOpening] = useState(false);
    const [isDoorOpenned, setIsDoorOpenned] = useState(false);
    const [isDoorClosing, setIsDoorClosing] = useState(false);
    const [isDoorClosed, setIsDoorClosed] = useState(true);
    const [doorOpacity, setDoorOpacity] = useState(0.4);

    const handleTurretGunonCollisionEnter = (gunPosition: string) => ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === 'player') {
            setCurrentHit(`${gunPosition}TurretGun`);
        }
    }

    const handleTurretGunonCollisionExist = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === 'player') {
            setCurrentHit('');
        }
    }

    useFrame(() => {

        if (playerRigidBody && playerRigidBody.current && vec3(playerRigidBody.current.translation()).z < 9) {
            setIsPlayerInBossArea(true);
        }
        else if (playerRigidBody && playerRigidBody.current && vec3(playerRigidBody.current.translation()).z > 9) {
            setIsPlayerInBossArea(false);
        }
        if (isPlayerInBossArea && isDoorOpening === false && isDoorClosing === false && isDoorClosed && playerRigidBody && playerRigidBody.current && vec3(playerRigidBody.current.translation()).z < 6) {
            setDoorOpacity(0);
        }
        if (isPlayerInBossArea && playerRigidBody && playerRigidBody.current && vec3(playerRigidBody.current.translation()).z > 6) {
            setDoorOpacity(0.4);
        }
        if (ePressed && currentHit && currentHit.includes('TurretGun')) {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsUsingTurret((prevState) => !prevState);
                setLastPressTime(currentTime);
            }
        }
        if (ePressed && currentHit && currentHit.includes('DoorToBossFight')) {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsDoorOpening(true);
            }
        }
        if (ePressed && currentHit && currentHit === ('ComputerChooseModelLevel5')) {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsInteracting((prev) => !prev);
            }
        }
    })

    const leftTurretGunPosition = { x: -48, y: 0.4, z: -10 };
    const middleTurretGunPosition = { x: -28, y: 0.4, z: -10 };
    const rightTurretGunPosition = { x: -8, y: 0.4, z: -10 };
    const TurretGunRectLightOffset = 2;

    return (
        <>
            <Level5FinalRoom1Map />
            {bossHealth > 0 &&
                <>
                    <BossController
                        idleDuration={bossActionDuration.idle}
                        chargingDuration={bossActionDuration.charging}
                        burstDuration={bossActionDuration.burst}
                        setBossChargingCountDown={setBossChargingCountDown}
                        setBossActionState={setBossActionState}
                        bulletName={["LeftTurretBullet", "MiddleTurretBullet", "RightTurretBullet"]}
                        bossHealth={bossHealth}
                        setBossHealth={setBossHealth}
                        bossRegenaration={{
                            increasePerInterval: 1,
                            interval: 1000,
                        }}
                        BossAttackPatternPredictModel={BossAttackPatternPredictModel}
                        setPredictionStat={setPredictionStat}/>
                    <DoorToBossFight
                        leftDoorToBossFightRef={leftDoorToBossFightRef}
                        rightDoorToBossFightRef={rightDoorToBossFightRef}
                        isDoorOpenned={isDoorOpenned}
                        setIsDoorOpenned={setIsDoorOpenned}
                        isDoorOpening={isDoorOpening}
                        setIsDoorOpening={setIsDoorOpening}
                        isDoorClosing={isDoorClosing}
                        setIsDoorClosing={setIsDoorClosing}
                        isDoorClosed={isDoorClosed}
                        setIsDoorClosed={setIsDoorClosed}
                        doorOpacity={doorOpacity}
                    />
                </>
            }
            {currentHit?.includes('TurretGun') && isUsingTurret &&
                <TurretGunControl
                    leftTurretGunPosition={leftTurretGunPosition}
                    middleTurretGunPosition={middleTurretGunPosition}
                    rightTurretGunPosition={rightTurretGunPosition}
                    config={[
                        {
                            bulletName: "LeftTurretBullet",
                            bulletSpeed: 100,
                            bulletColor: "#8c00ff",
                            firerate: 380,
                            damage: 4,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(160)
                        },
                        {
                            bulletName: "MiddleTurretBullet",
                            bulletSpeed: 100,
                            bulletColor: "green",
                            firerate: 380,
                            damage: 3,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(180)
                        },
                        {
                            bulletName: "RightTurretBullet",
                            bulletSpeed: 100,
                            bulletColor: "#00f7ff",
                            firerate: 380,
                            damage: 2,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(-160)
                        }
                    ]} />}
            <RigidBody
                name='LeftTurret'
                colliders={false}
                lockTranslations
                lockRotations
                position={[leftTurretGunPosition.x, leftTurretGunPosition.y, leftTurretGunPosition.z]}
                scale={[500, 500, 500]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(160)]}
                onCollisionEnter={handleTurretGunonCollisionEnter("Left")}
                onCollisionExit={handleTurretGunonCollisionExist}>
                <CuboidCollider args={[0.005, 0.004, 0.0065]} />
                <Item
                    item={
                        {
                            name: "TurretCannon",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineColor={"#8c00ff"}
                    outlineThickness={3}
                />
            </RigidBody>
            <RigidBody
                name='MiddleTurret'
                colliders={false}
                lockTranslations
                lockRotations
                position={[middleTurretGunPosition.x, middleTurretGunPosition.y, middleTurretGunPosition.z]}
                scale={[500, 500, 500]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(180)]}
                onCollisionEnter={handleTurretGunonCollisionEnter("Middle")}
                onIntersectionExit={handleTurretGunonCollisionExist}>
                <CuboidCollider args={[0.005, 0.004, 0.0065]} />
                <Item
                    item={
                        {
                            name: "TurretCannon",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineColor={"#00ff22"}
                    outlineThickness={3}
                />
            </RigidBody>
            <RigidBody
                name='RightTurret'
                colliders={false}
                lockTranslations
                lockRotations
                position={[rightTurretGunPosition.x, rightTurretGunPosition.y, rightTurretGunPosition.z]}
                scale={[500, 500, 500]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(-160)]}
                onCollisionEnter={handleTurretGunonCollisionEnter("Right")}
                onIntersectionExit={handleTurretGunonCollisionExist}>
                <CuboidCollider args={[0.005, 0.004, 0.0065]} />
                <Item
                    item={
                        {
                            name: "TurretCannon",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineColor={"#00f7ff"}
                    outlineThickness={3}
                />
            </RigidBody>
            <rectAreaLight
                intensity={25}
                width={1}
                height={20}
                color="#083bb2"
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                position={[leftTurretGunPosition.x, leftTurretGunPosition.y, leftTurretGunPosition.z + TurretGunRectLightOffset]} />
            <rectAreaLight
                intensity={25}
                width={1}
                height={20}
                color="#00ff22"
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                position={[middleTurretGunPosition.x, middleTurretGunPosition.y, middleTurretGunPosition.z + TurretGunRectLightOffset]} />
            <rectAreaLight
                intensity={25}
                width={1}
                height={20}
                color="#00ffff"
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                position={[rightTurretGunPosition.x, rightTurretGunPosition.y, rightTurretGunPosition.z + TurretGunRectLightOffset]} />
            <RigidBody
                name='ComputerChooseModelLevel5'
                colliders={false}
                lockTranslations
                lockRotations
                position={[-28, -2, 20]}
                scale={[500, 500, 500]}
                rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                onCollisionEnter={({ other }) => {
                    if (other.rigidBodyObject.name === 'player') {
                        setCurrentHit('ComputerChooseModelLevel5');
                    }
                }}
                onCollisionExit={({ other }) => {
                    if (other.rigidBodyObject.name === 'player') {
                        setCurrentHit('');
                    }
                }}>
                <CuboidCollider args={[0.0035, 0.0035, 0.0095]} />
                <Item
                    item={
                        {
                            name: "ComputerVideo",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineColor={"white"}
                    outlineThickness={3}
                />
            </RigidBody>

        </>
    )
}

export default Level5Room1Environment