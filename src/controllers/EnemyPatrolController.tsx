import React, { useRef, useState, useContext, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameContext } from '../contexts/GameContext';
import { EnemyAnimationState, useEnemyAnimation } from '../hooks/useEnemyAnimation';
import useAxios from '../hooks/useAxios';
import axiosInstanceAiService from '../api/aiService';
import Enemy2D from '../animation/Enemy2D';

export interface EnemyData {
    data_type: string,
    name: string,
    element: string,
    size: string,
    color: string,
    speed: number,
    mass: number,
    armor: number,
    attack: string,
    energy: number,
    pattern: string,
    weakness: string,
    detection_range: number,
    image_url: string
}

interface EnemyPatrolControllerProps {
    id: number;
    name: string;
    waypoints: number[][];
    angle: number;
    idleTime: number;
    chaseTimeLimit: number;
    patrolType: string; // 'loop' or 'turnback'
    showPath?: boolean;
    data: EnemyData;
    setEnemyPatrolInScene: React.Dispatch<React.SetStateAction<any[]>>;
    isPlayingSound?: boolean;
    speakerRef?: any;
    showLight?: boolean;
}

const EnemyPatrolController: React.FC<EnemyPatrolControllerProps> = ({ id, name, waypoints, angle, idleTime, chaseTimeLimit, patrolType, showPath, data, setEnemyPatrolInScene, isPlayingSound, speakerRef, showLight = true }) => {

    const { axiosFetch } = useAxios();

    const { playerRigidBody, isHidden, setIsEnemyHit, setEnemyHitName, setEnergy, isPaused } = useContext(GameContext);
    const { element, speed, color, detection_range, weakness } = data;

    const { animationState, setAnimationState } = useEnemyAnimation();
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const rigidBody = useRef<any>(null);

    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [movingForward, setMovingForward] = useState(true);

    const [movingSpeed, setMovingSpeed] = useState(speed);

    const detectionRange = detection_range;
    const detectionAngle = angle * (Math.PI / 180)

    const flashlightRef = useRef<THREE.SpotLight>(null);
    const flashLightTargetRef = useRef<THREE.Mesh>(null);

    const foundPlayer = useRef<boolean>(false);
    const [isChasing, setIsChasing] = useState(false);
    const [chaseTimer, setChaseTimer] = useState(chaseTimeLimit);

    const isCollisionProcessed = useRef<boolean>(false);
    const [enemyScale, setEnemyScale] = useState<number>(1);
    const [enemyOpacity, setEnemyOpacity] = useState<number>(2);

    // Initialization of isStopped state
    const [isStopped, setIsStopped] = useState(false);

    const lastHitPlayerTime = useRef(Date.now());

    useFrame(() => {
        if (foundPlayer.current === false && !isPlayingSound && !isPaused) {
            moveBetweenWaypoints();
        }
        else {
            setAnimationState(EnemyAnimationState.Running);
            if (isPlayingSound && speakerRef.current) {
                moveToSpeaker();
            }
            else {
                if(!isPaused) {
                    moveToPlayer();
                }
            }
        }
    });

    useEffect(() => {
        if (isChasing && flashlightRef.current && isHidden === false) {
            const timer = setInterval(() => {
                setChaseTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isChasing]);

    const moveBetweenWaypoints = () => {
        if (!rigidBody.current) return;

        const currentWaypoint = waypoints[currentWaypointIndex];
        const position = rigidBody.current.translation();

        // Calculate direction to the next waypoint
        const directionVec = new THREE.Vector3(
            currentWaypoint[0] - position.x,
            // 0.15,
            0,
            currentWaypoint[2] - position.z,
        );

        // Normalize direction
        const length = directionVec.length();
        directionVec.normalize();

        // Set direction state
        setDirection(directionVec.x < 0 ? 'left' : 'right');

        if (!isStopped) {
            // Move the rigid body towards the current waypoint
            setAnimationState(EnemyAnimationState.Running);
            rigidBody.current.setLinvel({
                x: directionVec.x * movingSpeed,
                y: directionVec.y * movingSpeed,
                z: directionVec.z * movingSpeed,
            });
        }

        // Check if the enemy is close to the waypoint
        if (length < 0.2 && flashlightRef.current) {
            // Stop briefly at the waypoint
            if (!isStopped) {
                setAnimationState(EnemyAnimationState.Idle);
                rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 });
                setIsStopped(true);

                flashlightRef.current.intensity = 0;
                setTimeout(() => {
                    // Move to the next waypoint after the delay
                    if (patrolType === 'turnback') {
                        if (movingForward) {
                            if (currentWaypointIndex === waypoints.length - 1) {
                                setMovingForward(false);
                                setCurrentWaypointIndex(currentWaypointIndex - 1);
                            } else {
                                setCurrentWaypointIndex(currentWaypointIndex + 1);
                            }
                        } else {
                            if (currentWaypointIndex === 0) {
                                setMovingForward(true);
                                setCurrentWaypointIndex(currentWaypointIndex + 1);
                            } else {
                                setCurrentWaypointIndex(currentWaypointIndex - 1);
                            }
                        }
                    } else {
                        // Loop behavior
                        setCurrentWaypointIndex((currentWaypointIndex + 1) % waypoints.length);
                    }
                    setIsStopped(false);
                    if (flashlightRef.current) {
                        flashlightRef.current.intensity = 100;
                    }
                }, idleTime * 1000);
            }
        } else {
            // Detect player
            detectPlayer(position, directionVec);
            updateFlashLightTarget(position, directionVec);
            updateFlashlight(position, detectionRange);
        }
    };

    const detectPlayer = (enemyPosition: THREE.Vector3, directionVec: THREE.Vector3) => {
        if (playerRigidBody && playerRigidBody.current) {
            const playerPosition = playerRigidBody.current.translation();

            // Calculate the vector from the enemy to the player
            const toPlayer = new THREE.Vector3(
                playerPosition.x - enemyPosition.x,
                playerPosition.y - enemyPosition.y,
                playerPosition.z - enemyPosition.z
            );

            // Calculate distance and angle to the player
            const distance = toPlayer.length();
            toPlayer.normalize();

            // Calculate the forward direction of the enemy (assuming facing along the Z-axis)

            const forward = new THREE.Vector3(0, 0, 1); // Adjust based on your enemy's rotation
            forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(directionVec.x, directionVec.z));

            // Calculate the angle between the enemy's forward direction and the vector to the player
            const angle = Math.acos(forward.dot(toPlayer));

            // Check if the player is within the detection range and angle
            if (distance < (detectionRange * enemyScale) && angle < detectionAngle && isHidden === false) {
                console.log("Player detected!");
                foundPlayer.current = true;
                setIsChasing(true); // Start chasing the player
                flashlightRef.current?.color.set('red');
            }
            else {
                flashlightRef.current?.color.set('white');
            }
        }
    };

    const updateFlashlight = (position: THREE.Vector3, range: number) => {
        if (flashlightRef.current) {
            const newPos = new THREE.Vector3(position.x, position.y + 1, position.z);
            if (!flashlightRef.current.position.equals(newPos)) {
                flashlightRef.current.position.set(position.x, position.y + 1, position.z);
            }
            if (flashlightRef.current.angle !== detectionAngle) {
                flashlightRef.current.angle = detectionAngle; // Set the cone angle
            }
            if (flashlightRef.current.distance !== range * enemyScale) {
                flashlightRef.current.distance = range * enemyScale; // Set the cone distance
            }
            flashlightRef.current.penumbra = 0.5; // Example penumbra
        }
    };

    const updateFlashLightTarget = (position: THREE.Vector3, directionVec: THREE.Vector3) => {
        if (flashLightTargetRef.current) {
            flashLightTargetRef.current.position.set(
                position.x + directionVec.x * detectionRange * enemyScale,
                position.y,
                position.z + directionVec.z * detectionRange * enemyScale);
        }
    }

    const moveToPlayer = () => {
        if (playerRigidBody && playerRigidBody.current) {

            const playerPosition = playerRigidBody.current.translation();
            const enemyPosition = rigidBody.current.translation();

            // Calculate direction to the next waypoint
            const directionVec = new THREE.Vector3(
                playerPosition.x - enemyPosition.x,
                playerPosition.y - enemyPosition.y,
                playerPosition.z - enemyPosition.z,
            );

            // Normalize direction
            const length = directionVec.length();
            directionVec.normalize();

            // Set direction state
            setDirection(directionVec.x < 0 ? 'left' : 'right');

            // Move the rigid body towards the current waypoint
            rigidBody.current.setLinvel({
                x: directionVec.x * movingSpeed,
                y: directionVec.y * movingSpeed,
                z: directionVec.z * movingSpeed,
            });

            updateFlashLightTarget(enemyPosition, directionVec);
            updateFlashlight(enemyPosition, length + 4);

            if (chaseTimer <= 0 || isHidden === true) {
                console.log("Chase time limit reached or player is hidden");
                foundPlayer.current = false;
                setIsChasing(false);
                setChaseTimer(chaseTimeLimit); // Reset timer
                if (flashlightRef.current) {
                    flashlightRef.current.intensity = 100;
                    flashlightRef.current.color.set('white');
                }
            }
        }
        else {
            console.log('Player rigid body is not available');
        }
    }

    const moveToSpeaker = () => {
        if (speakerRef && speakerRef.current) {

            const playerPosition = speakerRef.current.translation();
            const enemyPosition = rigidBody.current.translation();

            // Calculate direction to the next waypoint
            const directionVec = new THREE.Vector3(
                playerPosition.x - enemyPosition.x,
                playerPosition.y - enemyPosition.y,
                playerPosition.z - enemyPosition.z,
            );

            // Normalize direction
            const length = directionVec.length();
            directionVec.normalize();

            // Set direction state
            setDirection(directionVec.x < 0 ? 'left' : 'right');

            // Move the rigid body towards the current waypoint
            rigidBody.current.setLinvel({
                x: directionVec.x * movingSpeed,
                y: directionVec.y * movingSpeed,
                z: directionVec.z * movingSpeed,
            });

            updateFlashLightTarget(enemyPosition, directionVec);
            updateFlashlight(enemyPosition, length + 4);

            if (chaseTimer <= 0) {
                foundPlayer.current = false;
                setIsChasing(false);
                setChaseTimer(chaseTimeLimit); // Reset timer
            }
        }
        else {
            console.log('Player rigid body is not available');
        }
    }

    // Create a line geometry between waypoint
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        waypoints.map(waypoint => new THREE.Vector3(waypoint[0], waypoint[1], waypoint[2]))
    );

    // Add the last waypoint to close the loop or create the entire path
    if (patrolType === 'loop') {
        lineGeometry.setFromPoints([
            ...waypoints.map(waypoint => new THREE.Vector3(waypoint[0], waypoint[1], waypoint[2])),
            new THREE.Vector3(waypoints[0][0], waypoints[0][1], waypoints[0][2])  // Closing the loop if necessary
        ]);
    }

    const newWayPoint = () => {
        // Generate new waypoints to avoid collision
        const offset = 5; // Adjust the offset as needed
        let newWaypoints = waypoints.map(waypoint => {
            return [waypoint[0] + offset, waypoint[1], waypoint[2] + offset];
        }
        );
        return newWaypoints;
    }

    const AffectBeforeEvolve = (time: number) => {
        return new Promise((resolve) => {
            let elapsedTime = 0; // Elapsed time in seconds
            const interval = setInterval(() => {
                elapsedTime += 0.1; // Increment elapsed time by 0.1 seconds
                const opacity = 0.7 + 1.8 * Math.sin(elapsedTime * 8); // Sine wave calculation for smooth oscillation
                setEnemyOpacity(opacity);
                if (elapsedTime >= time) {
                    setEnemyOpacity(2);
                    return resolve(clearInterval(interval))
                }
            }, 100); // Update every 0.1 seconds
        })
    }

    const evolve = async () => {
        await AffectBeforeEvolve(2);
        switch (element) {
            case 'fire':
                // Fire element: Increase size
                setEnemyScale((prev) => prev + 0.5);
                break;
            case 'water':
                // Water element: Duplicate itself with new waypointsds
                const newWaypoints = newWayPoint();
                setEnemyPatrolInScene((prev) => {
                    const prop = {
                        name: name,
                        waypoints: newWaypoints,
                        angle: angle,
                        idleTime: idleTime,
                        chaseTimeLimit: chaseTimeLimit,
                        patrolType: patrolType,
                        showPath: showPath,
                        data: data,
                        showLight: false,
                    }
                    const newEnemyDataInScene = [...prev];
                    newEnemyDataInScene.push(prop);
                    return newEnemyDataInScene;
                });
                break;
            case 'earth':
                // Earth element: Increase mass and armor
                setEnemyScale((prev) => prev + 0.5); // Example to increase scale, you might want to apply other changes
                break;
            case 'lightning':
                // Lightning element: Increase speed
                setMovingSpeed((prev) => prev * 1.5);
                break;
            case 'metal':
                // Metal element: Add extra armor
                setEnemyScale((prev) => prev + 0.2); // Example to increase scale, adjust as needed
                break;
            default:
                console.log("Unknown element type");
                break;
        }
    }


    const mineProcessing = async () => {
        if (isCollisionProcessed.current === false) {
            isCollisionProcessed.current = true;
            const enemyData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    value
                ]).filter(([key]) => key !== 'weakness')
            );

            console.log(enemyData);
            const modifiedData = {
                element: enemyData.element,
                color: enemyData.color,
                size: enemyData.size,
                speed: enemyData.speed,
            }
            console.log(modifiedData);

            try {
                console.log(modifiedData);
                const response = await axiosFetch({
                    axiosInstance: axiosInstanceAiService,
                    method: "post",
                    url: `/classification/predict`,
                    requestConfig: {
                        userId: "u111362252",
                        model: {
                            // name: "enemy_weakness",
                            name: "enemy-lab-model-v1",
                            targetVariable: "weakness"
                        },
                        data: modifiedData
                    },
                });
                console.log(response);
                if (response.weakness === weakness) {
                    console.log("Prediction is correct");
                    setEnemyPatrolInScene((prevEnemies) => (
                        prevEnemies.filter((enemy) => (enemy.id !== id))
                    ))
                }
                else {
                    await evolve();
                    console.log("Prediction is incorrect");
                }
            } catch (error) {
                console.log(error);
            }

            setTimeout(() => {
                console.log("Mine processing completed");
                isCollisionProcessed.current = false
            }, 1000); // Reset the flag after 1 second
        }

    }

    const onObjectEnterEnemy = ({ other }) => {
        if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name.includes("mine")
        ) {
            mineProcessing();
        }
        if (other.rigidBodyObject && other.rigidBodyObject.name === "Kaboom-Level3") {
            console.log("Kaboom!");
        }
    }

    return (
        <>
            <RigidBody
                type='dynamic'
                ref={rigidBody}
                colliders={false}
                name='enemy_patrol'
                lockRotations
                position={[waypoints[0][0], waypoints[0][1], waypoints[0][2]]}
                userData={{ 
                    name: name,
                    parameter: data,
                }}
                onCollisionEnter={({ other }) => {
                    if (
                        other.rigidBodyObject &&
                        other.rigidBodyObject.name.includes("mine")
                    ) {
                        mineProcessing();
                    }
                    if (other.rigidBodyObject &&
                        other.rigidBodyObject.name === "Kaboom-Level3") {
                        console.log("Kaboom!");
                        setEnemyPatrolInScene((prevEnemies) => (
                            prevEnemies.filter((enemy) => (enemy.id !== id))
                        ))
                    }
                    if (other.rigidBodyObject &&
                        other.rigidBodyObject.name === "player" && isChasing && !isHidden) {
                        const currentTime = Date.now()
                        const elapsedTime = currentTime - lastHitPlayerTime.current
                        if(elapsedTime > 1000) {
                            lastHitPlayerTime.current = currentTime;
                            setIsEnemyHit(true);
                            setEnemyHitName(name);
                            setEnergy((prev) => prev - 3);
                        }
                    }
                }}>
                <Enemy2D
                    name={name}
                    animation={animationState}
                    direction={direction}
                    color={color}
                    scale={enemyScale}
                    opacityOptional={enemyOpacity} />
            </RigidBody>
            {flashLightTargetRef && showLight &&
                <spotLight
                    ref={flashlightRef}
                    intensity={0}
                    decay={0.4}
                    distance={detection_range}
                    color="white"
                    target={flashLightTargetRef.current?.children[0]}
                    visible={true}
                />
            }
            {/* Spot light target */}
            {showLight && <mesh position={[-4, 4, 8]} ref={flashLightTargetRef}>
                <mesh visible={false}>
                    <sphereGeometry args={[0.1, 32, 32]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </mesh>}
            {showPath &&
                <>
                    <line>
                        <bufferGeometry attach="geometry" {...lineGeometry} />
                        <lineBasicMaterial attach="material" color={color} linewidth={4} />
                    </line>
                </>
            }
        </>
    );
}

export default EnemyPatrolController;
