import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { PlainAnimator } from "three-plain-animator";
import idleSprite from "/images/EnemySlimeIdleAnim.png";
import runningSprite from "/images/EnemySlimeRunningAnim.png";
import { EnemyAnimationState } from '../../hooks/useEnemyAnimation';

const EnemyFollow2D = ({
    animation,
}: {
    animation: EnemyAnimationState;
}) => {

    // Load textures
    const idleSpriteTexture = useLoader(THREE.TextureLoader, idleSprite);
    const runningSpriteTexture = useLoader(THREE.TextureLoader, runningSprite);

    // Adjust texture settings for pixel art
    [idleSpriteTexture, runningSpriteTexture].forEach(texture => {
        texture.minFilter = THREE.NearestFilter;
    });

     // Initialize animators
  const [animators] = useState<{ [key in EnemyAnimationState]: PlainAnimator }>({
    idle: new PlainAnimator(idleSpriteTexture, 10, 1, 10, 10),
    running: new PlainAnimator(runningSpriteTexture, 8, 1, 8, 8)
  });

    // Animate based on the current state
    useFrame(() => {
        animators[animation].animate();
    });


    return (
        <mesh
            position={[0, -2.6, 0]}
            scale={[1, 1, 1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink"
            />
            {/* Use PlaneGeometry for a flat surface */}
            <planeGeometry args={[4, 5, 1]} />
            <meshStandardMaterial
                map={animators[animation].texture}
                transparent={true}
            />
        </mesh>
    );
};

export default EnemyFollow2D;
