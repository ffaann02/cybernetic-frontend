import { useFrame, useLoader } from '@react-three/fiber';
import React from 'react'
import golemHeadSprite from "/images/GolemHead.png";
import spiderHeadSprite from "/images/SpiderHead.png";
import slimeHeadSprite from "/images/SlimeHead.png";
import bossArmSprite from "/images/BossArm.png";
import bossBodySprite from "/images/BossBody.png";
import bossHeadSprite from "/images/BossHead.png"
import bossLegSprite from "/images/BossLeg.png"
import * as THREE from 'three';

interface Props {
    name?: string;
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    opacity?: number;
    movingRange?: number;
}

const EnemyBodyPart: React.FC<Props> = ({
    name,
    position,
    scale,
    rotation,
    opacity = 1,
    movingRange = 1,
}) => {
    // Load all textures
    const GolemHeadTexture = useLoader(THREE.TextureLoader, golemHeadSprite);
    const SpiderHeadTexture = useLoader(THREE.TextureLoader, spiderHeadSprite);
    const SlimeHeadTexture = useLoader(THREE.TextureLoader, slimeHeadSprite);
    const BossArmTexture = useLoader(THREE.TextureLoader, bossArmSprite);
    const BossBodyTexture = useLoader(THREE.TextureLoader, bossBodySprite);
    const BossHeadTexture = useLoader(THREE.TextureLoader, bossHeadSprite);
    const BossLegTexture = useLoader(THREE.TextureLoader, bossLegSprite);

    // Create a map of names to textures
    const textureMap = {
        Golem: GolemHeadTexture,
        Spider: SpiderHeadTexture,
        Slime: SlimeHeadTexture,
        BossArm: BossArmTexture,
        BossBody: BossBodyTexture,
        BossHead: BossHeadTexture,
        BossLeg: BossLegTexture,
    };

    // Select the texture based on the `name` prop
    const selectedTexture = textureMap[name || 'Golem'];

    const mesh1Ref = React.useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (mesh1Ref.current) {
            mesh1Ref.current.position.y = (position[1] - 1) + Math.sin(time * 1.5) * movingRange;
        }
    });

    return (
        <mesh
            ref={mesh1Ref}
            position={position}
            scale={scale}
            rotation={rotation}>
            <planeGeometry args={[4, 5]} />
            <meshStandardMaterial
                map={selectedTexture}
                transparent={true}
                opacity={opacity}
            />
        </mesh>
    )
}

export default EnemyBodyPart;
