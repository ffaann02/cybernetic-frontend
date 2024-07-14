import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, vec3 } from '@react-three/rapier';
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameContext } from '../contexts/GameContext';
import EnemyFollow2D from '../game_object/enemy/EnemyFollow2D';
import { EnemyAnimationState, useEnemyAnimation } from '../hooks/useEnemyAnimation';

interface Props {
    speed: number;
    position: THREE.Vector3Tuple;
    showArea?: boolean;
    idleAreaRadius: number;
    chasingAreaRadius: number;
}

const EnemyFollowController: React.FC<Props> = ({ speed, position, showArea = false, idleAreaRadius, chasingAreaRadius }) => {

    const { playerRigidBody } = useContext(GameContext);
    const { animationState, setAnimationState, updateAnimationState } = useEnemyAnimation();

    const rigidBody = useRef<any>(null);
    const enemy = useRef<any>(null);

    const idleAreaRef = useRef<THREE.Mesh>(null);
    const chasingAreaRef = useRef<THREE.Mesh>(null);

    const moveToPlayer = (delta: number) => {
        if (playerRigidBody && playerRigidBody.current) {
            updateAnimationState(true);
            const playerPosition = vec3(playerRigidBody.current.translation());
            const enemyPosition = rigidBody.current.translation();

            const direction = new THREE.Vector3(
                playerPosition.x - enemyPosition.x,
                playerPosition.y - enemyPosition.y,
                playerPosition.z - enemyPosition.z
            ).normalize();

            const moveDistance = speed * delta;
            const impulse = direction.multiplyScalar(moveDistance);

            const newPos = new THREE.Vector3(
                enemyPosition.x + impulse.x,
                enemyPosition.y,
                enemyPosition.z + impulse.z
            );

            rigidBody.current.setTranslation(newPos, true);
        }
        else {
            console.log('Player rigid body is not available');
        }
    }


    useFrame((_, delta) => {
        if (playerRigidBody && playerRigidBody.current) {
            const playerPosition = playerRigidBody.current.translation();
            const enemyPosition = rigidBody.current.translation();

            const idlePosition2D = new THREE.Vector3(
                position[0],
                0,
                position[2]
            );

            const enemyPosition2D = new THREE.Vector3(
                enemyPosition.x,
                0,
                enemyPosition.z
            );

            const playerPosition2D = new THREE.Vector3(
                playerPosition.x,
                0,
                playerPosition.z
            )

            // Update detection area position
            if (chasingAreaRef.current && idleAreaRef.current) {
                const idlePosY = idleAreaRef.current.position.y;
                chasingAreaRef.current.position.set(enemyPosition.x, idlePosY + 0.1, enemyPosition.z);
            }

            if (idlePosition2D.distanceTo(playerPosition2D) < idleAreaRadius) {
                moveToPlayer(delta);
                if (enemyPosition2D.distanceTo(playerPosition2D) < 1) {
                    console.log('Player reached')
                    return;
                }
            }
            else {
                if (enemyPosition2D.distanceTo(playerPosition2D) < chasingAreaRadius) {
                    if (enemyPosition2D.distanceTo(playerPosition2D) < 1) {
                        console.log('Player reached')
                        return;
                    }
                    moveToPlayer(delta);
                }
                return;
            }
        }
    });

    // Inside EnemyFollow component
    useEffect(() => {
        setAnimationState(EnemyAnimationState.Idle);
        if (idleAreaRef.current) {
            idleAreaRef.current.rotation.x = -90 * (Math.PI / 180); // 10 degrees in radians
        }
        if (chasingAreaRef.current) {
            chasingAreaRef.current.rotation.x = -90 * (Math.PI / 180); // 10 degrees in radians
        }
    }, []);

    // Create a sphere geometry to visualize the detection area
    const activeArea = showArea ? (
        <group>
            <mesh ref={chasingAreaRef} position={[0, 0, 0]}>
                <circleGeometry args={[chasingAreaRadius, 32]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.4} />
            </mesh>
            <mesh ref={idleAreaRef} position={[position[0], 0, position[2]]}>
                <circleGeometry args={[idleAreaRadius, 32]} />
                <meshBasicMaterial color="red" transparent opacity={0.1} />
            </mesh>
        </group>
    ) : null;

    return (
        <group>
            <RigidBody
                ref={rigidBody}
                colliders="trimesh"
                name='enemy_follow'
                position={position}
                lockRotations
                mass={50}
                gravityScale={9.8}
                linearDamping={10}
                onCollisionEnter={({ other }) => {
                    console.log(other.rigidBodyObject?.name);
                }}>
                <group ref={enemy}>
                    <EnemyFollow2D animation={animationState} />
                    <CapsuleCollider
                        args={[
                            0.25, // height
                            1.05,    // radius
                        ]}
                        position={[0, -3.6, 0]}
                    />
                    {/* <mesh
                        key="enemy_follow"
                        // position={[0, 0.25, 0]}
                        scale={[1, 1, 1]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="hotpink" />
                    </mesh> */}
                </group>
            </RigidBody>
            {activeArea}
        </group>
    );
};

export default EnemyFollowController;
