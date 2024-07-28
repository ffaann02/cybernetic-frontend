import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { PlainAnimator } from "three-plain-animator";
import { BallCollider, CapsuleCollider, CuboidCollider } from '@react-three/rapier';
import BossIdleSprite from "/images/BossIdleAnim.png";
import BossBurstSprite from "/images/BossBurstAnim.png";
import { BossAnimationState } from '../hooks/useBossAnimation';

const Boss2D = ({
    animation,
    scale,
    opacity,
    isHologram,
}: {
    animation: BossAnimationState;
    scale: number;
    opacity?: number;
    isHologram?: boolean;
}) => {

    // Load textures
    const idleSpriteTexture = useLoader(THREE.TextureLoader, BossIdleSprite);
    const burstSpriteTexture = useLoader(THREE.TextureLoader, BossBurstSprite);

    // Adjust texture settings for pixel art
    [idleSpriteTexture, burstSpriteTexture].forEach(texture => {
        texture.minFilter = THREE.NearestFilter;
    });

    const [animators] = useState<{ [key in BossAnimationState]: PlainAnimator }>({
        idle: new PlainAnimator(idleSpriteTexture, 6, 1, 6, 6),
        burst: new PlainAnimator(burstSpriteTexture, 10, 1, 10, 10),
      });

    // Animate based on the current state
    useFrame(() => {
        animators[animation].animate();
    });

    return (
        <group>
            <mesh
                position={[0, -0.7, 0]}
                scale={[1, 1, 1]}>
                <planeGeometry args={[(25 * scale), (25 * scale), 1]} />
                <meshStandardMaterial
                    map={animators[animation].texture}
                    transparent={true}
                    opacity={opacity ? opacity : 1.5}
                    color={isHologram ? "cyan" : "none"}
                />
            </mesh>
            <CuboidCollider
                args={[10, 8.5, 1]}
                position={[0, -0, 0]}
            />
        </group>
    );
};

export default Boss2D;
