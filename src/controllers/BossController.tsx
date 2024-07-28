import React, { useContext, useEffect, useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import Boss2D from '../animation/Boss2D';
import { BossAnimationState, useBossAnimation } from '../hooks/useBossAnimation';
import BurstDebugPlate from '../game/level5-final/scene-object/room1/BurstDebugPlate';
import BurstMeteo from '../game/level5-final/scene-object/room1/BurstMeteo';
import { GameContext } from '../contexts/GameContext';

interface BossControllerProps {
    idleDuration?: number;
    burstDuration?: number;
    chargingDuration?: number;
    burstPoints?: number;
    setBossChargingCountDown: (count: number) => void;
    setBossActionState: (state: string) => void;
    bulletName: string[];
    isOpenDoor?: boolean;
}

export interface MeteoDataInterface {
    id: number;
    position: { x: number; y: number; z: number };
    isReachedFloor: boolean;
    opacity: number;
}

const BossController: React.FC<BossControllerProps> = ({
    idleDuration = 5,
    burstDuration = 5,
    chargingDuration = 5,
    burstPoints = 30,
    setBossChargingCountDown,
    setBossActionState,
    bulletName,
    isOpenDoor,
}) => {

    const { setCurrentHit, setIsUsingTurret } = useContext(GameContext);
    const rigidBody = useRef<any>(null);

    const { animationState, setAnimationState } = useBossAnimation();
    const [bossState, setBossState] = useState('idle');

    const [debugPlatePosition, setDebugPlatePosition] = useState<any[]>();
    const [warningOpacity, setWarningOpacity] = useState(1);

    const [meteoData, setMeteoData] = useState<MeteoDataInterface[]>([]);

    const rows = 6;
    const cols = 10;
    const gap = 2.5;

    const randomMeteoPosY = () => {
        return Math.floor(Math.random() * (70 - 40 + 1)) + 40;
    }

    const CalculateBurstPosition = () => {
        const pointsSet = new Set<string>();
        while (pointsSet.size < burstPoints) {
            let x = Math.floor(Math.random() * rows);
            let y = Math.floor(Math.random() * cols);
            pointsSet.add(`${x},${y}`);
        }

        const points = Array.from(pointsSet).map(point => point.split(',').map(Number));
        const debug: { position: { x: number; y: number; z: number }, color: string }[] = [];
        const positions: { x: number; y: number; z: number }[] = [];
        const meteos: MeteoDataInterface[] = [];

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const color = points.some(([x, y]) => x === j && y === i) ? "red" : "green";
                const x = i * (3 + gap) - 52;
                const y = 0;
                const z = j * (3 + gap) - 30;
                debug.push({ position: { x, y, z }, color });
                if (color === "red") {
                    positions.push({ x, y: randomMeteoPosY(), z });
                    meteos.push({ id: positions.length, position: { x, y: randomMeteoPosY(), z }, isReachedFloor: false, opacity: 1 });
                }
            }
        }

        setDebugPlatePosition(debug);
        setMeteoData(meteos);
    }

    useEffect(() => {
        if (isOpenDoor && isOpenDoor === true) {
            let idleTimeout: NodeJS.Timeout;
            let burstTimeout: NodeJS.Timeout;
            if (bossState === 'idle') {
                idleControl();
                idleTimeout = setTimeout(() => {
                    setBossState('charging');
                }, idleDuration * 1000);
            } else if (bossState === 'charging') {
                chargeAndBurstControl(() => {
                    setBossActionState('idle')
                    setBossState('idle');
                });
            }
            return () => {
                clearTimeout(idleTimeout);
                clearTimeout(burstTimeout);
            };
        }
        else if (isOpenDoor && isOpenDoor === false){
            setBossState('idle');
        }
    }, [bossState, idleDuration, burstDuration, setAnimationState, isOpenDoor]);

    const idleControl = () => {
        // console.log("Idle");
        setAnimationState(BossAnimationState.Idle);
        setDebugPlatePosition([]);
        setMeteoData([]);
    }

    const chargeAndBurstControl = (onBurstComplete: () => void) => {
        CalculateBurstPosition();
        let countdown = chargingDuration;
        const delayInterval = setInterval(() => {
            // console.log(`charging delay: ${countdown}`);
            setBossActionState('charging');
            setBossChargingCountDown(countdown);
            countdown -= 1;
            if (countdown < 0) {
                clearInterval(delayInterval);
                let burstCountdown = burstDuration;
                const burstInterval = setInterval(() => {
                    setAnimationState(BossAnimationState.Burst);
                    setDebugPlatePosition([]);
                    setBossActionState('bursting');
                    setBossState('bursting');
                    // console.log(`bursting: ${burstCountdown}`);
                    burstCountdown -= 1;
                    if (burstCountdown <= 0) {
                        clearInterval(burstInterval);
                        onBurstComplete();
                    }
                }, 1000);
            }
        }, 1000);
    };

    const handleCollisionEnter = (id: number) => ({ other }) => {
        const colliderName = other.colliderObject.name;
        const { name } = other.rigidBodyObject;
        if (colliderName === "floor" || colliderName.includes("TurretGun")) {
            if (meteoData.length > 0) {
                const fadeInterval = setInterval(() => {
                    setMeteoData(prevData => {
                        return prevData.map(data => {
                            if (data.id === id) {
                                const newOpacity = Math.max(data.opacity - 0.01, 0);
                                if (newOpacity <= 0) {
                                    clearInterval(fadeInterval);
                                }
                                return {
                                    ...data,
                                    isReachedFloor: true,
                                    opacity: newOpacity
                                }
                            }
                            else {
                                return data;
                            }
                        });
                    });
                }, 30);
            }
        }
        if (name === 'player') {
            setCurrentHit('');
            setIsUsingTurret(false);
        }
    }

    const bossBodyColliderEnter = ({ other }) => {
        const { userData } = other.rigidBodyObject;
        if (bulletName.includes(userData.bulletName)) {
            console.log(`got hit by ${userData.bulletName}`);
        }
    }

    return (
        <group>
            <RigidBody
                ref={rigidBody}
                colliders={false}
                name='boss'
                lockTranslations
                lockRotations
                position={[-28, 8.65, -38]}
                onIntersectionEnter={bossBodyColliderEnter}>
                <Boss2D animation={animationState} scale={1} />
            </RigidBody>
            <BurstMeteo
                bossState={bossState}
                meteoData={meteoData}
                handleCollisionEnter={handleCollisionEnter} />
            <BurstDebugPlate
                debugPlatePosition={debugPlatePosition}
                warningOpacity={warningOpacity}
                setWarningOpacity={setWarningOpacity} />
        </group>
    );
}

export default BossController;
