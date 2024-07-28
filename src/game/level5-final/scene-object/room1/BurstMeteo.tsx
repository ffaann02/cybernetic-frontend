import React, { useEffect, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { MeteoDataInterface } from '../../../../controllers/BossController';

interface Props {
    bossState: string;
    meteoData: MeteoDataInterface[];
    handleCollisionEnter: (id: number) => ({ other }) => void;
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
                    scale={[3, 3, 3]}
                    mass={100}
                    gravityScale={10}
                    onCollisionEnter={handleCollisionEnter(meteo.id)}
                >
                    <mesh>
                        <cylinderGeometry args={[0.4, 0.4, 10]} />
                        <meshStandardMaterial color="red" transparent opacity={meteo.opacity} />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
}

export default BurstMeteo;
