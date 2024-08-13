import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import BossController from '../../../../controllers/BossController'
import { Level5FinalRoom1Map } from '../../map/Level5-Final-Room1-Map'
import { CuboidCollider, RigidBody, vec3 } from '@react-three/rapier'
import { degreeNumberToRadian } from '../../../../utils'
import { Item } from '../../../shared-object/object/Item'
import { GameContext } from '../../../../contexts/GameContext'
import { Cylinder, shaderMaterial, Sphere, useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import TurretGunControl from './TurretGunControl'
import DoorToBossFight from './DoorToBossFight'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'
import * as THREE from 'three'
import { DissolveMaterial } from '../../../../components/DissolveMaterial';
import { useLevel5Context } from '../../../../contexts/SceneContext/Level5Context'
import golemHeadSprite from "/images/GolemHead.png";
import EnemyBodyPart from '../../../shared-object/object/EnemyBodyPart'
import ItemWithUrlSpin from '../../../shared-object/object/ItemWithUrlSpin'

const Level5Room1Environment = ({ }) => {

    const {
        playerRigidBody,
        currentHit,
        setCurrentHit,
        isUsingTurret,
        setIsUsingTurret,
        isPlayerInBossArea,
        setIsPlayerInBossArea,
        setIsInteracting } = useContext(GameContext);
    const {
        bossActionDuration,
        setBossChargingCountDown,
        setBossActionState,
        bossHealth,
        setBossHealth,
        BossAttackPatternPredictModel,
        setPredictionStat,
    } = useLevel5Context();

    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const [lastPressTime, setLastPressTime] = useState(0);

    const leftDoorToBossFightRef = useRef<any>(null);
    const rightDoorToBossFightRef = useRef<any>(null);
    const [isDoorOpening, setIsDoorOpening] = useState(false);
    const [isDoorOpenned, setIsDoorOpenned] = useState(false);
    const [isDoorClosing, setIsDoorClosing] = useState(false);
    const [isDoorClosed, setIsDoorClosed] = useState(true);
    const [doorOpacity, setDoorOpacity] = useState(1);

    const waitingPositionRef1 = useRef(null)
    const waitingPositionRef2 = useRef(null)
    const waitingPositionRef3 = useRef(null)

    // In boss area
    const waitingPositionRef4 = useRef(null)
    const waitingPositionRef5 = useRef(null)
    const waitingPositionRef6 = useRef(null)
    const waitingPositionRef7 = useRef(null)
    const waitingPositionRef8 = useRef(null)
    const waitingPositionRef9 = useRef(null)

    const [bubbles, setBubbles] = useState([]);

    const [bossItemWasPicked, setBossItemWasPicked] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate a new bubble with random position and speed
            setBubbles((prevBubbles) => [
                ...prevBubbles,
                {
                    id: Math.random(),
                    position: [
                        (Math.random() - 0.5) * 4, // random x position within the cylinder's radius
                        3, // start below the cylinder
                        (Math.random() - 0.5) * 4, // random z position within the cylinder's radius
                    ],
                    speed: Math.random() * 0.02 + 0.01, // random speed
                },
            ]);
        }, 750); // Adjust the interval for bubble generation frequency

        return () => clearInterval(interval);
    }, []);

    // console.log(bubbles);
    useFrame(() => {
        // console.log(bubbles);
        setBubbles(
            (prevBubbles) =>
                prevBubbles
                    .map((bubble) => ({
                        ...bubble,
                        position: [
                            bubble.position[0],
                            bubble.position[1] - bubble.speed, // move the bubble up
                            bubble.position[2],
                        ],
                    }))
                    .filter((bubble) => bubble.position[1] > -3) // keep bubbles within the cylinder (fade out at the top)
        );
    });

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
            setDoorOpacity(1);
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

    const boxMaterial = new THREE.MeshStandardMaterial({ color: "red" });

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
                        setPredictionStat={setPredictionStat} />
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
                            bulletSpeed: 200,
                            bulletColor: "#8c00ff",
                            firerate: 380,
                            damage: 4,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(160)
                        },
                        {
                            bulletName: "MiddleTurretBullet",
                            bulletSpeed: 200,
                            bulletColor: "green",
                            firerate: 380,
                            damage: 3,
                            weaponOffset: { x: 0, y: 0, z: 0.5 },
                            turretRotateZ: degreeNumberToRadian(180)
                        },
                        {
                            bulletName: "RightTurretBullet",
                            bulletSpeed: 200,
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
                position={[-28, 1, 20]}
                scale={[500, 500, 400]}
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
            {(bossHealth <= 0 && !bossItemWasPicked) &&
                <>
                    <RigidBody
                        colliders="trimesh"
                        type='fixed'
                        lockTranslations
                        lockRotations
                        position={[-28, 4, -35]}
                        scale={[5, 5, 5]}
                        rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                        onCollisionEnter={({ other}) => {
                            const { name } = other.rigidBodyObject;
                            if (name === 'player') {
                                setBossItemWasPicked(true);
                            }
                        }}>
                        {/* <CuboidCollider args={[0.005, 0.004, 0.0065]} /> */}
                        <ItemWithUrlSpin
                            item={
                                {
                                    name: "PickupSphere",
                                    position: [0, 0, 0],
                                    rotation: 0,
                                    scale: [1, 1, 1],
                                    fileType: "glb",
                                    spinSpeed: 0.5,
                                    spinAxis: 'xy'
                                }
                            }
                            sceneName='level5final'
                        />
                    </RigidBody>
                    <mesh position={[-28, 4, -35]}>
                        <sphereGeometry args={[7.5, 32, 32]} />
                        <FakeGlowMaterial
                            glowColor="#ff0040"
                            falloff={2}
                            glowInternalRadius={5}
                            opacity={0.6}
                        />
                    </mesh>
                </>
            }
            <EnemyBodyPart
                name='Spider'
                position={[-58, 6, 16]}
                scale={[0.8, 0.8, 0.8]}
                rotation={[0, degreeNumberToRadian(30), 0]}
                opacity={0.8}
            />
            <EnemyBodyPart
                name='Golem'
                position={[-63, 6, 28]}
                scale={[0.8, 0.8, 0.8]}
                rotation={[0, degreeNumberToRadian(45), 0]}
                opacity={1.5}
            />
            <EnemyBodyPart
                name='Slime'
                position={[3, 6, 18]}
                scale={[0.8, 0.8, 0.8]}
                rotation={[0, degreeNumberToRadian(-15), 0]}
                opacity={1.5}
            />

            <RigidBody
                ref={waitingPositionRef1}
                colliders={false}
                lockTranslations
                lockRotations
                position={[-63, 1.5, 28]}
                scale={[24, 17, 24]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#ff0000"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.6}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="white"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>
            <RigidBody
                ref={waitingPositionRef2}
                colliders={false}
                lockTranslations
                lockRotations
                position={[-58, 1.5, 16]}
                scale={[24, 17, 24]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#ff4800"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.6}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="white"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>
            <RigidBody
                ref={waitingPositionRef3}
                colliders={false}
                lockTranslations
                lockRotations
                position={[3, 1.5, 18]}
                scale={[24, 17, 24]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#eb0753"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.6}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="white"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>

            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[-60, 1, 0]}
                scale={[800, 800, 800]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(-30), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiLoot",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>
            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[-60, 4, 0]}
                scale={[800, 800, 800]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(-30), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiLoot",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>
            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[-64, 1, -2]}
                scale={[800, 800, 800]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(10), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiLoot",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>
            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[2, 2, -3]}
                scale={[800, 800, 800]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(-120), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiLoot",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>
            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[3, 0, 2]}
                scale={[600, 600, 600]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(25), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiContainer",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>
            <RigidBody
                colliders="trimesh"
                lockTranslations
                lockRotations
                position={[3, 3.1, 2]}
                scale={[600, 600, 600]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(25), degreeNumberToRadian(0)]}>
                <Item
                    item={
                        {
                            name: "ScifiContainer",
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            fileType: "glb",
                        }
                    }
                />
            </RigidBody>

            {/* Area room */}
            {(isPlayerInBossArea && doorOpacity <= 0 || (isDoorOpening || isDoorClosing)) &&
                <>
                    <EnemyBodyPart
                        name='BossBody'
                        position={[6, 19, -35]}
                        scale={[0.5, 0.5, 0.5]}
                        rotation={[0, degreeNumberToRadian(-30), 0]}
                        opacity={0.4}
                    />
                    <EnemyBodyPart
                        name='BossHead'
                        position={[6, 14, -30]}
                        scale={[0.5, 0.5, 0.5]}
                        rotation={[0, degreeNumberToRadian(45), 0]}
                        opacity={0.8}
                    />
                    <EnemyBodyPart
                        name='BossArm'
                        position={[6, 9, -23]}
                        scale={[0.6, 0.6, 0.6]}
                        rotation={[0, degreeNumberToRadian(-15), 0]}
                        opacity={0.6}
                    />
                    <EnemyBodyPart
                        name='BossHead'
                        position={[-67, 19, -35]}
                        scale={[0.5, 0.5, 0.5]}
                        rotation={[0, degreeNumberToRadian(-30), 0]}
                        opacity={0.4}
                    />
                    <EnemyBodyPart
                        name='BossBody'
                        position={[-67, 14, -30]}
                        scale={[0.5, 0.5, 0.5]}
                        rotation={[0, degreeNumberToRadian(45), 0]}
                        opacity={0.8}
                    />
                    <EnemyBodyPart
                        name='BossLeg'
                        position={[-67, 9, -23]}
                        scale={[0.6, 0.6, 0.6]}
                        rotation={[0, degreeNumberToRadian(-15), 0]}
                        opacity={0.6}
                    />
                    <RigidBody
                        ref={waitingPositionRef4}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[6, 13, -35]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#5900ff"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                    <RigidBody
                        ref={waitingPositionRef5}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[-67, 13, -35]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#5900ff"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                    <RigidBody
                        ref={waitingPositionRef7}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[6, 10, -30]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#00a2ff"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                    <RigidBody
                        ref={waitingPositionRef6}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[-67, 10, -30]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#00a2ff"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                    <RigidBody
                        ref={waitingPositionRef8}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[-67, 5.4, -23]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#00ff6a"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                    <RigidBody
                        ref={waitingPositionRef9}
                        colliders={false}
                        lockTranslations
                        lockRotations
                        position={[6, 5.4, -23]}
                        scale={[12, 15, 12]}
                        rotation={[
                            degreeNumberToRadian(180),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                    >
                        <Cylinder
                            scale={[0.05, 0.1, 0.05]}
                            args={[3, 3, 6]}
                            position={[0, -0.3, 0]}
                            rotation={[
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                                degreeNumberToRadian(0),
                            ]}
                        >
                            <FakeGlowMaterial
                                glowColor="#00ff6a"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.6}
                            />
                            {bubbles.map((bubble) => (
                                <Sphere
                                    key={bubble.id}
                                    args={[0.175, 16, 16]}
                                    position={bubble.position}
                                >
                                    <FakeGlowMaterial
                                        glowColor="white"
                                        falloff={2}
                                        glowInternalRadius={0}
                                        opacity={0.2}
                                    />
                                </Sphere>
                            ))}
                        </Cylinder>
                        <Item
                            item={{
                                name: "PortalPad",
                                position: [0, 0, 0],
                                rotation: [0, 0, 0],
                                scale: [0.1, 0.1, 0.1],
                                fileType: "glb",
                            }}
                        />
                    </RigidBody>
                </>
            }
        </>
    )
}

export default Level5Room1Environment