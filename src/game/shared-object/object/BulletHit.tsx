import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, Vector3 } from "three";

const bulletHitcolor = new Color("red");
bulletHitcolor.multiplyScalar(12);

const AnimatedBox = ({ scale, target, speed, opacity }) => {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref && ref.current && ref.current.scale.x > 0) {
            ref.current.scale.x =
                ref.current.scale.y =
                ref.current.scale.z -=
                speed * delta * MathUtils.randFloat(2, 4);
        }
        ref.current.position.lerp(target, speed);
    });
    return <Instance ref={ref} scale={scale} position={[0, 0, 0]} />;
};

export const BulletHit = ({ nb = 100, position, config, minScale, maxScale, onEnded }) => {
    const boxes = useMemo(
        () =>
            Array.from({ length: nb }, () => ({
                target: new Vector3(
                    MathUtils.randFloat(-3, 3),
                    MathUtils.randFloat(-3, 3),
                    MathUtils.randFloat(-3, 3)
                ),
                scale: MathUtils.randFloat(minScale, maxScale),
                speed: MathUtils.randFloat(0.1, 0.3),
                opacity: MathUtils.randFloat(0.2, 1.0), // Add random opacity
            })),
        [nb]
    );

    useEffect(() => {
        setTimeout(() => {
            onEnded();
        }, 300);
    }, [onEnded]);

    return (
        <group position={[position.x, position.y, position.z]}>
            <Instances>
                <boxGeometry />
                <meshStandardMaterial transparent opacity={0.5} toneMapped={false} color={config.bulletColor === "green" ? "#00ff22" : config.bulletColor} />
                {boxes.map((box, i) => (
                    <AnimatedBox key={i} {...box} />
                ))}
            </Instances>
        </group>
    );
};
