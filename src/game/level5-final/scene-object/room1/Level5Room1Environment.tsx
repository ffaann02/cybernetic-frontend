import React, { useContext, useRef, useState } from 'react'
import BossController from '../../../../controllers/BossController'
import { Level5FinalRoom1Map } from '../../map/Level5-Final-Room1-Map'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
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
}) => {

    const { currentHit, setCurrentHit, isUsingTurret, setIsUsingTurret } = useContext(GameContext);
    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const [lastPressTime, setLastPressTime] = useState(0);

    const leftDoorToBossFightRef = useRef<any>(null);
    const rightDoorToBossFightRef = useRef<any>(null);
    const [isOpenDoor, setIsOpenDoor] = useState(false);

    const handleTurretGunonCollisionEnter = (gunPosition: string) => ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === 'player') {
            setCurrentHit(`${gunPosition}TurretGun`);
            // setIsInteracting(true);
        }
    }

    const handleTurretGunonCollisionExist = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === 'player') {
            setCurrentHit('');
        }
    }

    useFrame(() => {
        if (ePressed && currentHit && currentHit.includes('TurretGun')) {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsUsingTurret((prevState) => !prevState);
                setLastPressTime(currentTime);
            }
        }
        if(ePressed && currentHit && currentHit.includes('DoorToBossFight')) {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                console.log('Door to boss fight');
                setLastPressTime(currentTime);
                setIsOpenDoor(true);
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
            <BossController
                idleDuration={bossActionDuration.idle}
                chargingDuration={bossActionDuration.charging}
                burstDuration={bossActionDuration.burst}
                setBossChargingCountDown={setBossChargingCountDown}
                setBossActionState={setBossActionState}
                bulletName={["LeftTurretBullet", "MiddleTurretBullet", "RightTurretBullet"]}
                isOpenDoor={isOpenDoor} />
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
                            damage: 10,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(160)
                        },
                        {
                            bulletName: "MiddleTurretBullet",
                            bulletSpeed: 100,
                            bulletColor: "green",
                            firerate: 380,
                            damage: 10,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(180)
                        },
                        {
                            bulletName: "RightTurretBullet",
                            bulletSpeed: 100,
                            bulletColor: "#00f7ff",
                            firerate: 380,
                            damage: 10,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(-160)
                        }
                    ]} />}
            <DoorToBossFight 
                leftDoorToBossFightRef={leftDoorToBossFightRef}
                rightDoorToBossFightRef={rightDoorToBossFightRef}
                isOpenDoor={isOpenDoor}
            />
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
        </>
    )
}

export default Level5Room1Environment