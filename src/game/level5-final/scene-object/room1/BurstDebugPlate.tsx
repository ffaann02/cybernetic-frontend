import React, { useEffect, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { degreeNumberToRadian } from '../../../../utils';
import { Outlines } from "@react-three/drei";

const Plate = ({ color, position, warningOpacity, setWarningOpacity }) => {

    return (
        <>
            {color === "red" ?
                <RigidBody
                    type="fixed"
                    colliders={false}
                    position={position}
                    scale={[1, 1, 1]}
                    lockRotations
                    lockTranslations
                    rotation={[
                        degreeNumberToRadian(90),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <mesh>
                        <ringGeometry args={[2, 1.5, 32]} />
                        <meshStandardMaterial color={"#ff5f5f"} transparent={true} opacity={warningOpacity} />
                    </mesh>
                </RigidBody>
                : null}
        </>
    );
};

interface BurstDebugPlateProps {
    debugPlatePosition: { color: string, position: { x: number, y: number, z: number } }[] | undefined;
}

const BurstDebugPlate: React.FC<BurstDebugPlateProps> = ({ debugPlatePosition, warningOpacity, setWarningOpacity }) => {

    useEffect(() => {
        const interval = setInterval(() => {
            setWarningOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <group>
            {debugPlatePosition
                ? debugPlatePosition.map((plate, index) =>
                    <Plate
                        key={index}
                        color={plate.color}
                        position={[plate.position.x, plate.position.y, plate.position.z]}
                        warningOpacity={warningOpacity}
                        setWarningOpacity={setWarningOpacity} />
                )
                : null}
        </group>
    );
};

export default BurstDebugPlate;
