import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import React, { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three';

interface Props {
    speed: number;
    point1: THREE.Vector3Tuple;
    point2: THREE.Vector3Tuple;
    showPath?: boolean;
}

const EnemySimple: React.FC<Props> = ({ speed, point1, point2, showPath }) => {

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

        rigidBody.current.setTranslation(newPos, true);
        if (newPos.distanceTo(target) < 1) {
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

        rigidBody.current.setTranslation(newPos, true);
        if (newPos.distanceTo(target) < 1) {
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
                mass={50}
                gravityScale={9.8}
                position={point1}>
                <mesh
                    key="enemy_fix_path"
                    position={[0, 0, 0]}
                    scale={[1, 1, 1]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </RigidBody>
            {showPath &&
                <line>
                    <bufferGeometry attach="geometry" {...lineGeometry} />
                    <lineBasicMaterial attach="material" color="red" linewidth={4} />
                </line>}
        </group>
    )
}

export default EnemySimple