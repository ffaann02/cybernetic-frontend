import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { PlainAnimator } from "three-plain-animator";
import idleSprite from "/images/Spider_IdleAnim.png";
import runningSprite from "/images/Spider_RunAnim.png";
import { EnemyAnimationState } from '../../../hooks/useEnemyAnimation';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

const Spider2D = ({
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
    idle: new PlainAnimator(idleSpriteTexture, 7, 1, 7, 7),
    running: new PlainAnimator(runningSpriteTexture, 5, 1, 5, 5)
  });

    // Animate based on the current state
    useFrame(() => {
        animators[animation].animate();
    });


    return (
        <mesh
            position={[0, -2.8, -0.2]}
            scale={[1, 1, 1]}>
            <meshStandardMaterial color="hotpink"/>
            {/* Use PlaneGeometry for a flat surface */}
            <planeGeometry args={[4, 5, 1]} />
            <meshStandardMaterial
                map={animators[animation].texture}
                transparent={true}
            />
        </mesh>
    );
};

export default Spider2D;
