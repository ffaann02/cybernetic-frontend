import { RigidBody } from '@react-three/rapier'
import React, { useEffect, useState, useRef } from 'react'
import { degreeNumberToRadian } from "../../../utils";
import Boss2D from '../../../animation/Boss2D'
import { useBossAnimation } from '../../../hooks/useBossAnimation'
import { useFrame } from '@react-three/fiber'
import { Item } from '../../shared-object/object/Item'


const BossHologram = ({
    bossHoloGramRef,
}) => {
    const { animationState, setAnimationState } = useBossAnimation();
    const [bossOpacity, setBossOpacity] = useState(0.1);
    const [bossState, setBossState] = useState('idle');
    const idleDuration = 5;
    const burstDuration = 5;
    const timeRef = useRef(0); // Reference to keep track of time

    // useEffect(() => {
    //     let idleTimeout: NodeJS.Timeout;
    //     let burstTimeout: NodeJS.Timeout;
    //     if (bossState === 'idle') {
    //         setAnimationState('idle');
    //         setBossState('idle');
    //         idleTimeout = setTimeout(() => {
    //             setBossState('burst');
    //         }, idleDuration * 1000);
    //     } else if (bossState === 'burst') {
    //         setAnimationState('burst');
    //         burstTimeout = setTimeout(() => {
    //             setBossState('idle');
    //         }, burstDuration * 1000);
    //     }
    //     return () => {
    //         clearTimeout(idleTimeout);
    //         clearTimeout(burstTimeout);
    //     };
    // }, [bossState, idleDuration, burstDuration, setAnimationState]);

    useFrame((state, delta) => {
        timeRef.current += delta; // Increment time

        if (bossHoloGramRef && bossHoloGramRef.current) {
            const opacity = 0.2 + 0.15 * Math.sin(timeRef.current * 8); // Sine wave calculation for smooth oscillation
            setBossOpacity(opacity);
        }
    });

    return (
        <>
            <RigidBody
                lockTranslations
                lockRotations
                scale={[10.5, 10.5, 10.5]}
                position={[-7, -1.3, 0]}>
            </RigidBody>
            <RigidBody
                ref={bossHoloGramRef}
                lockTranslations
                lockRotations
                scale={[0.5, 0.5, 0.5]}
                position={[20, 20, -70]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(-60), degreeNumberToRadian(0)]}>
                <Boss2D scale={10} animation={animationState} opacity={bossOpacity} isHologram={true} />
            </RigidBody>
            <rectAreaLight
                intensity={8}
                width={8}
                height={5}
                color="black"
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                position={[2, 3, 10]} />
        </>
    )
}

export default BossHologram
