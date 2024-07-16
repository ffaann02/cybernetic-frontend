import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import React, { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three';
import Spider2D from '../game/shared/enemy/Spider2D';
import { EnemyAnimationState, useEnemyAnimation } from '../hooks/useEnemyAnimation';

interface Props {
    speed: number;
    point1: THREE.Vector3Tuple;
    point2: THREE.Vector3Tuple;
    showPath?: boolean;
}

const EnemyGuardController: React.FC<Props> = ({ speed, point1, point2, showPath }) => {

    const { animationState, setAnimationState, updateAnimationState } = useEnemyAnimation();

    const rigidBody = useRef<any>(null);
    const isReachedPoint1 = useRef(false);
    const isReachedPoint2 = useRef(false);

    const moveToPoint1 = (delta: number) => {
        const target = new THREE.Vector3(point1[0], point1[1], point1[2]);
        const position = rigidBody.current.translation();
        const direction = new THREE.Vector3(
            target.x - position.x,
            target.y - position.y,
            target.z - position.z
        ).normalize();

        const moveDistance = speed * delta;
        const impulse = direction.multiplyScalar(moveDistance);

        const newPos = new THREE.Vector3(
            position.x + impulse.x,
            position.y,
            position.z + impulse.z
        );
        setAnimationState(EnemyAnimationState.Running);
        rigidBody.current.setTranslation(newPos, true);
        if (newPos.distanceTo(target) < 1.5) {
            isReachedPoint1.current = true;
            isReachedPoint2.current = false;
            return;
        }
    }

    const moveToPoint2 = (delta: number) => {
        const target = new THREE.Vector3(point2[0], point2[1], point2[2]);
        const position = rigidBody.current.translation();
        const direction = new THREE.Vector3(
            target.x - position.x,
            target.y - position.y,
            target.z - position.z
        ).normalize();

        const moveDistance = speed * delta;
        const impulse = direction.multiplyScalar(moveDistance);

        const newPos = new THREE.Vector3(
            position.x + impulse.x,
            position.y,
            position.z + impulse.z
        );
        setAnimationState(EnemyAnimationState.Running);
        rigidBody.current.setTranslation(newPos, true);
        if (newPos.distanceTo(target) < 1.5) {
            isReachedPoint1.current = false;
            isReachedPoint2.current = true;
        }
    }


    useFrame((_, delta) => {
        if (isReachedPoint1.current === false && isReachedPoint2.current === false) {
            moveToPoint1(delta)
        }
        else if (isReachedPoint1.current === true && isReachedPoint2.current === false) {
            moveToPoint2(delta)
        }
        else if (isReachedPoint1.current === false && isReachedPoint2.current === true) {
            moveToPoint1(delta)
        }
    });

    useLayoutEffect(() => {
        if (rigidBody.current) {
            rigidBody.current.setTranslation(new THREE.Vector3(point1[0], point1[1], point1[2]), true);
        }
    }, [])

    // Create a line geometry between point1 and point2
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2])
    ]);

    return (
        <group>
            <RigidBody
                ref={rigidBody}
                colliders="trimesh"
                name='enemy_fix_path'
                lockRotations
                gravityScale={9.8}
                position={point1}
                linearDamping={10}>
                <group>
                    <Spider2D animation={animationState} />
                    <CapsuleCollider
                        args={[
                            0.08, // height
                            1.05,    // radius
                        ]}
                        position={[0, -0.5, 0]}
                    />
                    <mesh castShadow position={[-1.5, 4, 0.8]} scale={[1, 0.1, 0.75]}>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshStandardMaterial transparent={true} opacity={0} />
                    </mesh>
                </group>
                {/* <mesh
                    key="enemy_fix_path"
                    position={[0, 0, 0]}
                    scale={[1, 1, 1]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="hotpink" />
                </mesh> */}
            </RigidBody>
            {showPath &&
                <line>
                    <bufferGeometry attach="geometry" {...lineGeometry} />
                    <lineBasicMaterial attach="material" color="red" linewidth={4} />
                </line>}
        </group>
    )
}

export default EnemyGuardController