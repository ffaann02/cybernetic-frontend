import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { MeteoDataInterface } from '../../../../controllers/BossController';
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial';

interface Props {
    bossState: string;
    meteoData: MeteoDataInterface[];
    handleCollisionEnter: (id: number, position: any) => ({ other }) => void;
}

const BurstMeteo: React.FC<Props> = ({
    bossState,
    meteoData,
    handleCollisionEnter,
}) => {

    return (
        <>
            {(bossState === "bursting") && meteoData?.map((meteo, index) => (
                <RigidBody
                    key={index}
                    type={meteo.isReachedFloor ? "fixed" : "dynamic"}
                    lockTranslations={meteo.isReachedFloor}
                    lockRotations
                    position={[meteo.position.x, meteo.position.y, meteo.position.z]}
                    scale={[4, 4, 4]}
                    mass={100}
                    gravityScale={10}
                    onCollisionEnter={handleCollisionEnter(meteo.id, meteo.position)}
                >
                    <mesh>
                        <cylinderGeometry args={[0.4, 0.4, 10]} />
                        <FakeGlowMaterial
                            glowColor='red'
                            falloff={2}
                            glowInternalRadius={1}
                            opacity={meteo.opacity} />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
}

export default BurstMeteo;
