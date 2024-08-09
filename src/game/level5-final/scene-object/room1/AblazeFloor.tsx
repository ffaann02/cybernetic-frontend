import { RigidBody } from '@react-three/rapier';
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

const AblazeFloor = ({ meteoPosition, bossState }) => {

    const meshRefs = useRef({});
    const [fadeProgresses, setFadeProgresses] = useState({});

    useFrame((state, delta) => {
        let newFadeProgresses;
        let hasChanges = false;

        if (meteoPosition.length > 0) {
            newFadeProgresses = { ...fadeProgresses };
            meteoPosition?.forEach((meteo, index) => {
                if (meteo.isReachedFloor && (!fadeProgresses[index] || fadeProgresses[index] < 1)) {
                    const currentProgress = fadeProgresses[index] || 0;
                    const newProgress = Math.min(currentProgress + delta * 1.5, 1);
                    newFadeProgresses[index] = newProgress;
                    hasChanges = true;

                    const mesh = meshRefs.current[index];
                    if (mesh) {
                        mesh.material.color.lerpColors(
                            new Color('red'),
                            new Color('black'),
                            newProgress
                        );
                    }
                }
            });
        }
        else {
            newFadeProgresses = {};
            setFadeProgresses({});
        }

        if (hasChanges) {
            setFadeProgresses(newFadeProgresses);
        }
    });

    return (
        <>
            {(bossState === "bursting") && meteoPosition.length > 0 && meteoPosition.map((meteo, index) => {
                if (meteo.isReachedFloor === true) {
                    return (
                        <>
                            <RigidBody
                                key={index}
                                colliders={false}
                                type={'fixed'}
                                lockTranslations
                                lockRotations
                                position={[meteo.position.x, 0, meteo.position.z]}
                                scale={[4, 4, 4]}
                            >
                                <mesh ref={(el) => (meshRefs.current[index] = el)}>
                                    <cylinderGeometry args={[0.6, 0.6, 0.01]} />
                                    <meshStandardMaterial color="red" transparent opacity={meteo.ablazeOpacity} />
                                </mesh>
                            </RigidBody>
                            {/* <group position={[meteo.position.x, 1, meteo.position.z]}>
                                <Instances>
                                    <boxGeometry />
                                    <meshStandardMaterial transparent opacity={0.5} toneMapped={false} color={"#ff5e00"} />
                                    {boxes.map((box, i) => (
                                        <AnimatedBox key={i} {...box} />
                                    ))}
                                </Instances>
                            </group> */}
                        </>
                    )
                }
            })}
        </>
    );
};

export default AblazeFloor;