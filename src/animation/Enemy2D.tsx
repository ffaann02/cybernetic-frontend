import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { PlainAnimator } from "three-plain-animator";
import { CapsuleCollider } from '@react-three/rapier';
import { enemyConfigs, EnemyConfig } from './EnemyConfig';
import { EnemyAnimationState } from '../hooks/useEnemyAnimation';

const Enemy2D = ({
    name,
    animation,
    direction,
    color,
    scale,
}: {
    name: string;
    animation: EnemyAnimationState;
    direction: "left" | "right";
    color: string;
    scale: number;
}) => {
    const config: EnemyConfig = enemyConfigs[name];

    // Load textures
    const idleSpriteTexture = useLoader(THREE.TextureLoader, config.sprite.idle);
    const runningSpriteTexture = useLoader(THREE.TextureLoader, config.sprite.running);

    // Adjust texture settings for pixel art
    [idleSpriteTexture, runningSpriteTexture].forEach(texture => {
        texture.minFilter = THREE.NearestFilter;
    });

    // Initialize animators
    const [animators] = useState<{ [key in EnemyAnimationState]: PlainAnimator }>({
        idle: new PlainAnimator(
            idleSpriteTexture, 
            config.plainAnimator.idle.tilesAmountHorizontally, 
            config.plainAnimator.idle.tilesAmountVertically, 
            config.plainAnimator.idle.tilesAmount, 
            config.plainAnimator.idle.tilesHorizontal),
        running: new PlainAnimator(
            runningSpriteTexture, 
            config.plainAnimator.running.tilesAmountHorizontally, 
            config.plainAnimator.running.tilesAmountVertically, 
            config.plainAnimator.running.tilesAmount, 
            config.plainAnimator.running.tilesHorizontal)
    });

    // Animate based on the current state
    useFrame(() => {
        animators[animation].animate();
    });

    return (
        <group>
            <mesh
                position={config.mesh.position}
                scale={[direction === "left" ? -1 : 1, 1, 1]}>
                <planeGeometry args={[4 * scale, 4 * scale, 1]} />
                <meshStandardMaterial
                    map={animators[animation].texture}
                    transparent={true}
                    color={color}
                    opacity={1}
                />
            </mesh>
            <CapsuleCollider
                args={config.collider.args.map(value => value * scale) as [number, number]}
                position={config.collider.position.map(value => value * scale) as [number, number, number]}
            />
        </group>
    );
};

export default Enemy2D;
