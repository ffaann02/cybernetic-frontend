import { RigidBody } from '@react-three/rapier'
import React, { useContext, useRef } from 'react'
import { } from 'three-stdlib'
import Enemy2D from '../animation/Enemy2D'
import { EnemyAnimationState, useEnemyAnimation } from '../hooks/useEnemyAnimation'
import { useFrame } from '@react-three/fiber'
import { GameContext } from '../contexts/GameContext'
import * as THREE from 'three'

interface Props {
    position: [number, number, number]
    rotation: [number, number, number]
    movingSpeed?: number
    showArea?: boolean
    attackAreaRadius?: number
    activeMoving?: boolean
}

const GolemController: React.FC<Props> = ({
    position,
    rotation,
    movingSpeed = 5,
    showArea = false,
    attackAreaRadius = 5.5,
    activeMoving = true
}) => {

    const { playerRigidBody, setIsEnemyHit, setEnemyHitName, setEnergy, isDeath } = useContext(GameContext);
    const { animationState, setAnimationState } = useEnemyAnimation();
    const golemRigidBody = useRef<any>(null);
    const [direction, setDirection] = React.useState<'left' | 'right'>('left');
    const lastHitPlayerTime = useRef(Date.now());

    const attackAreaRef = useRef<THREE.Group>(null);

    const moveToPlayer = () => {
        if (!golemRigidBody.current || !playerRigidBody?.current) return;

        const playerPosition = playerRigidBody.current.translation();
        const golemPosition = golemRigidBody.current.translation();

        const directionVec = new THREE.Vector3(
            playerPosition.x - golemPosition.x,
            0,
            playerPosition.z - golemPosition.z,
        );

        // Normalize direction
        const length = directionVec.length();
        directionVec.normalize();

        // Set direction state
        setDirection(directionVec.x < 0 ? 'left' : 'right');

        setAnimationState(EnemyAnimationState.Running);
        golemRigidBody.current.setLinvel({
            x: directionVec.x * movingSpeed,
            y: directionVec.y * movingSpeed,
            z: directionVec.z * movingSpeed,
        });

        if (length <= attackAreaRadius + 1 && (playerPosition.y - golemPosition.y < 2)) {
            setAnimationState(EnemyAnimationState.Attack);
            golemRigidBody.current.setLinvel({
                x: 0,
                y: 0,
                z: 0,
            });
            const currentTime = Date.now()
            const elapsedTime = currentTime - lastHitPlayerTime.current
            if(elapsedTime > 1000) {
                lastHitPlayerTime.current = currentTime;
                const impulse = new THREE.Vector3();
                playerRigidBody.current.applyImpulse(
                    new THREE.Vector3(impulse.x, 15 * 75, impulse.z)
                );
                setIsEnemyHit(true);
                setEnemyHitName('Golem');
                setEnergy((prev) => prev - 4);
                golemRigidBody.current.setLinvel({
                    x: directionVec.x * movingSpeed,
                    y: directionVec.y * movingSpeed,
                    z: directionVec.z * movingSpeed,
                });
            }
        }
        // else if (length > attackAreaRadius || length > attackAreaRadius + 0.8) {
        //     setAnimationState(EnemyAnimationState.Running);
        //     golemRigidBody.current.setLinvel({
        //         x: directionVec.x * movingSpeed,
        //         y: directionVec.y * movingSpeed,
        //         z: directionVec.z * movingSpeed,
        //     });
        // }

        // Update detection attack position
        if (attackAreaRef.current) {
            attackAreaRef.current.position.set(golemPosition.x, golemPosition.y + 0.1, golemPosition.z);
            attackAreaRef.current.rotation.x = -90 * (Math.PI / 180); // 10 degrees in radians
        }
    }

    useFrame(() => {
        if(activeMoving === true && !isDeath) {
            moveToPlayer();
        }
        else{
            setAnimationState(EnemyAnimationState.Idle);
        }
    })

    // Create a sphere geometry to visualize the detection area
    const activeArea = showArea ? (
        <group ref={attackAreaRef}>
            <mesh position={[0, 0, 0]}>
                <circleGeometry args={[attackAreaRadius, 32]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.4} />
            </mesh>
        </group>
    ) : null;

    return (
        <>
            <RigidBody
                name='enemy_golem'
                ref={golemRigidBody}
                type='dynamic'
                lockRotations
                position={position}
                rotation={rotation}>
                <Enemy2D
                    name='Golem'
                    animation={animationState}
                    direction={direction}
                    color='white'
                    scale={1.5} />
            </RigidBody>
            {activeArea}
        </>
    )
}

export default GolemController