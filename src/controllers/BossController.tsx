import React, { useContext, useEffect, useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import Boss2D from '../animation/Boss2D';
import { BossAnimationState, useBossAnimation } from '../hooks/useBossAnimation';
import BurstDebugPlate from '../game/level5-final/scene-object/room1/BurstDebugPlate';
import BurstMeteo from '../game/level5-final/scene-object/room1/BurstMeteo';
import { GameContext } from '../contexts/GameContext';
import { bossAttackPatternsArray } from '../game/level5-final/scene-object/BossAttackPattern';
import useAxios from '../hooks/useAxios';
import axiosInstanceAiService from '../api/aiService';

interface BossControllerProps {
    idleDuration?: number;
    burstDuration?: number;
    chargingDuration?: number[];
    setBossChargingCountDown: (count: number) => void;
    setBossActionState: (state: string) => void;
    bulletName: string[];
    bossHealth: number;
    setBossHealth: (health: number) => void;
    bossRegenaration: { increasePerInterval: number; interval: number };
    setPredictionStat: (stat: any) => void;
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
    chargingDuration = [2,3,4,5],
    setBossChargingCountDown,
    setBossActionState,
    bulletName,
    bossHealth,
    setBossHealth,
    bossRegenaration,
    BossAttackPatternPredictModel,
    setPredictionStat,
}) => {

    const { setCurrentHit, setIsUsingTurret, bossParameter, setBossParameter, isPlayerInBossArea } = useContext(GameContext);
    const { axiosFetch } = useAxios();
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

    const getRandomParameters = () => {
        const energySources = [...new Set(bossAttackPatternsArray.map(pattern => pattern.energySource))];
        const soundBreathings = [...new Set(bossAttackPatternsArray.map(pattern => pattern.soundBreathing))];
        const chargingTimes = [...new Set(bossAttackPatternsArray.map(pattern => pattern.chargingTime))];
        const turrets = [...new Set(bossAttackPatternsArray.map(pattern => pattern.lastActiveTurret))];

        return {
            energySource: energySources[Math.floor(Math.random() * energySources.length)],
            soundBreathing: soundBreathings[Math.floor(Math.random() * soundBreathings.length)],
            chargingTime: chargingTimes[Math.floor(Math.random() * chargingTimes.length)],
            lastActiveTurret: bossParameter.lastActiveTurret ? bossParameter.lastActiveTurret : turrets[Math.floor(Math.random() * turrets.length)],
        };
    };

    const getPredictPatternByParameter = async (
        energySource: string, 
        soundBreathing: string, 
        chargingTime: number, 
        lastActiveTurret: string,
        bossHealth: number
    ) => {
        try {
            const data = {
                energySource: energySource,
                soundBreathing: soundBreathing,
                chargingTime: chargingTime,
                lastActiveTurret: lastActiveTurret,
                bossHealth: bossHealth
            };
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: `/classification/predict`,
                requestConfig: {
                    userId: "u111362252",
                    model: {
                        name: BossAttackPatternPredictModel.value,
                        targetVariable: "pattern"
                    },
                    data: data
                },
            });
            return response;
        } catch (error) {
            console.log('Error:', error);
            if (error.response) {
                console.log('Error Response Data:', error.response.data);
                console.log('Error Response Status:', error.response.status);
            } 
        }
    }

    const getRandomPattern = async() => {
        const { energySource, soundBreathing, chargingTime, lastActiveTurret } = getRandomParameters();
        const predictedResult = await getPredictPatternByParameter(energySource, soundBreathing, chargingTime, lastActiveTurret, bossHealth);
        const predictedPattern = bossAttackPatternsArray.find(pattern => pattern.name === predictedResult.pattern);

        // Try to find an exact matching pattern
        const exactMatch = bossAttackPatternsArray.find(pattern =>
            pattern.energySource === energySource &&
            pattern.soundBreathing === soundBreathing &&
            pattern.chargingTime === chargingTime &&
            pattern.lastActiveTurret === lastActiveTurret &&
            pattern.bossHealth === bossHealth
        );

        if (exactMatch) {
            // console.log(`Exact match found for energySource: ${energySource}, soundBreathing: ${soundBreathing}, chargingTime: ${chargingTime}`);
            // return exactMatch;
            return { actualPattern: exactMatch, predictPattern: predictedPattern };
        }

        // If no exact match, find the closest match
        const closestMatch = bossAttackPatternsArray.reduce((closest, current) => {
            let currentScore = 0;
            let closestScore = 0;

            // Score based on energySource
            if (current.energySource === energySource) currentScore += 2;
            if (closest.energySource === energySource) closestScore += 2;

            // Score based on soundBreathingsetBossChargingCountDown
            if (current.soundBreathing === soundBreathing) currentScore += 3;
            if (closest.soundBreathing === soundBreathing) closestScore += 3;

            if (current.lastActiveTurret === lastActiveTurret) currentScore += 1;
            if (closest.lastActiveTurret === lastActiveTurret) closestScore += 1;

            if (current.bossHealth === bossHealth) currentScore += 1;
            if (closest.bossHealth === bossHealth) closestScore += 1;

            // Score based on chargingTime (1 point for every second difference, negative)
            currentScore -= Math.abs(current.chargingTime - chargingTime);
            closestScore -= Math.abs(closest.chargingTime - chargingTime);

            // console.log(`currentScore: ${currentScore}, closestScore: ${closestScore}`);
            return currentScore > closestScore ? current : closest;
        });

        // console.log(`No exact match found for energySource: ${energySource}, soundBreathing: ${soundBreathing}, chargingTime: ${chargingTime}`);
        return { actualPattern: closestMatch, predictPattern: predictedPattern };
    };

    const MapPatternToPosition = async() => {
        const { actualPattern, predictPattern } = await getRandomPattern();
        setBossParameter((prev) => ({
            ...prev,
            energySource: actualPattern.energySource,
            soundBreathing: actualPattern.soundBreathing,
            chargingTime: actualPattern.chargingTime,
        }));
        console.log(`Actual Pattern: ${actualPattern.name}, Predicted Pattern: ${predictPattern.name}`);
        if(actualPattern.name === predictPattern.name) {
            setPredictionStat((prev) => {
                return prev.map((item) => {
                    if (item.name === BossAttackPatternPredictModel.name) {
                        console.log('Correct Prediction');
                        return {
                            name: item.name,
                            predict: {
                                correct: item.predict.correct + 1,
                                wrong: item.predict.wrong
                            }
                        }
                    }
                    return item;
                });
            })
        }
        else{
            setPredictionStat((prev) => {
                return prev.map((item) => {
                    if (item.name === BossAttackPatternPredictModel.name) {
                        return {
                            name: item.name,
                            predict: {
                                correct: item.predict.correct,
                                wrong: item.predict.wrong + 1
                            }
                        }
                    }
                    return item;
                });
            })
        }

        const debug: { position: { x: number; y: number; z: number }, color: string }[] = [];
        const meteos: MeteoDataInterface[] = [];

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const color = actualPattern.distribution[j][i] === 1 ? "red" : "green";
                const x = i * (3 + gap) - 52;
                const y = 0;
                const z = j * (3 + gap) - 30;
                // debug.push({ position: { x, y, z }, color });
                if (color === "red") {
                    meteos.push({ id: meteos.length + 1, position: { x, y: randomMeteoPosY(), z }, isReachedFloor: false, opacity: 1 });
                }
            }
        }

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const color = predictPattern.distribution[j][i] === 1 ? "red" : "green";
                const x = i * (3 + gap) - 52;
                const y = 0;
                const z = j * (3 + gap) - 30;
                debug.push({ position: { x, y, z }, color });
            }
        }

        setDebugPlatePosition(debug);
        setMeteoData(meteos);

        return { actualPattern: actualPattern, predictPattern: predictPattern };
    }

    useEffect(() => {
        if (isPlayerInBossArea && isPlayerInBossArea === true) {
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
        else if (isPlayerInBossArea && isPlayerInBossArea === false) {
            setBossState('idle');
        }
    }, [bossState, idleDuration, burstDuration, setAnimationState, isPlayerInBossArea]);

    const idleControl = () => {
        setAnimationState(BossAnimationState.Idle);
        setDebugPlatePosition([]);
        setMeteoData([]);
    }

    const chargeAndBurstControl = async(onBurstComplete: () => void) => {
        const { actualPattern } = await MapPatternToPosition();
        let countdown = actualPattern.chargingTime;
        const delayInterval = setInterval(() => {
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
                    burstCountdown -= 1;
                    if (burstCountdown <= 0) {
                        clearInterval(burstInterval);
                        onBurstComplete();
                    }
                }, 1000);
            }
        }, 1000);
    };

    useEffect(() => {
        let regenerationInterval: NodeJS.Timeout;
        if (!isPlayerInBossArea && bossHealth > 0 && bossHealth < 100) {
            regenerationInterval = setInterval(() => {
                setBossHealth(prevHealth => Math.min(prevHealth + bossRegenaration.increasePerInterval, 100));
            }, bossRegenaration.interval); // Regenerate 1 health every 3 seconds
        }
        return () => {
            if (regenerationInterval) {
                clearInterval(regenerationInterval);
            }
        };
    }, [isPlayerInBossArea, bossHealth, setBossHealth]);

    useEffect(() => {
        setBossParameter((prev) => ({
            ...prev,
            bossHealth: bossHealth
        }));
    }, [bossHealth])

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
            setBossHealth(prevHealth => prevHealth - userData.damage);
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
                setWarningOpacity={setWarningOpacity}
            />
        </group>
    );
}

export default BossController;
