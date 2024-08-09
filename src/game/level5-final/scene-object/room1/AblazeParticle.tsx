import { useFrame } from '@react-three/fiber';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Color, MathUtils, Vector3 } from 'three';
import { Instance, Instances } from '@react-three/drei';

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


const AblazeParticle = ({ particleId, position, onEnded }) => {

    const nb = 25
    const boxes = useMemo(
        () =>
            Array.from({ length: nb }, () => ({
                target: new Vector3(
                    MathUtils.randFloat(-3, 3),
                    MathUtils.randFloat(-3, 3),
                    MathUtils.randFloat(-3, 3)
                ),
                scale: MathUtils.randFloat(0.3, 0.5),
                speed: MathUtils.randFloat(0.1, 0.3),
                opacity: MathUtils.randFloat(0.2, 1.0), // Add random opacity
            })),
        [nb]
    );

    useEffect(() => {
        setTimeout(() => {
            // console.log("onEnded", particleId)
            onEnded(particleId);
        }, 300);
    }, [onEnded]);

    return (
        <>
            <group position={[position.x, 1, position.z]}>
                <Instances>
                    <boxGeometry />
                    <meshStandardMaterial transparent opacity={0.5} toneMapped={false} color={"#ff5e00"} />
                    {boxes.map((box, i) => (
                        <AnimatedBox key={i} {...box} />
                    ))}
                </Instances>
            </group>
        </>
    )
}

export default AblazeParticle