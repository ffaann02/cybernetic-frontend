import React, { useContext, useEffect, useRef, useState } from 'react';
import { CollisionEnterPayload, CollisionExitPayload, RigidBody } from "@react-three/rapier";
import { ItemWithOutlineCondition } from './ItemWithOutlineCondition';
import { degreeNumberToRadian } from "../../../../utils";
import { GameContext } from '../../../../contexts/GameContext';
import { useKeyboardControls } from '@react-three/drei';
import { Controls } from '../../../../controllers/CharacterController';
import { ItemDropped } from './ItemDropped';
import { Vector3 } from 'three';

export interface LaserTargetObjectProps {
    id: string;
    rigidBody: {
        position: number[];
        scale: number[];
        rotation: number[];
    };
    item: {
        name: string;
        position: number[];
        fileType: string;
        rotation: number;
        scale: number[];
    };
    outline?: {
        normalThickness: number;
        focusedThickness: number;
    };
    spin?: {
        isSpin: boolean;
        spinSpeed: number;
        spinAxis: string;
    };
}

const LaserTargetObject = ({ objectData, setCurrentLaserTarget, dropedObject, setDropedObject, setObjectCollectedList, dataCollectNotify }) => {

    // const [targetObject, setTargetObject] = useState<LaserTargetObjectProps[]>(objectData);
    const { setCurrentHit } = useContext(GameContext);
    const [hoverTarget, setHoverTarget] = useState<string | null>(null);
    const [lastPressTime, setLastPressTime] = useState(0);

    const handleTargetObjectLaser = (other: CollisionEnterPayload, targetName: string, objectPosition: Vector3) => {
        if (other.colliderObject && other.colliderObject.parent) {
            const { name } = other.colliderObject;
            if (name === "CameraLaser") {
                console.log(`Laser hit ${targetName}`);
                setHoverTarget(targetName);
                const distance = calculateDistance(other.colliderObject.parent.position, objectPosition);
                setCurrentHit(`Computer-camera-01-trigger:${distance}`);
                setCurrentLaserTarget(targetName);
            }
        }
    };

    const handleTargetObjectLaserExit = (other: CollisionExitPayload, targetName: string) => {
        if (other.colliderObject) {
            const { name } = other.colliderObject;
            if (name === "CameraLaser") {
                setHoverTarget(null);
                setCurrentHit("Computer-camera-01");
                setCurrentLaserTarget("");
            }
        }
    };

    const handlePickUpObject = (other: CollisionEnterPayload, targetName: string) => {
        if (other.rigidBodyObject) {
            const { name } = other.rigidBodyObject;
            if (name === "player") {
                console.log("Pick up object");
                setDropedObject((prev) => {
                    const newDropedObject = prev.filter((object) => object.item.name !== targetName);
                    return newDropedObject;
                });
                setObjectCollectedList((prevList) => {
                    const duplicate = prevList.find((data) => data.name === targetName);
                    if (duplicate) {

                        return prevList;
                    }
                    else {
                        if (currentTime - lastPressTime > 200) {
                            setLastPressTime(currentTime);
                            dataCollectNotify.current.show({
                                unstyled: true,
                                closable: false,
                                life: 2000,
                                content: (props) => (
                                    <div className="flex relative z-[100] rounded-lg px-2.5 py-2 gap-x-2">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/8654/8654975.png"
                                            className="w-16 h-16 bg-white rounded-xl"
                                        />
                                        <div className="">
                                            <p className="text-2xl font-semibold text-white">
                                                Data Collected!
                                            </p>
                                            <p className="text-lg font-semibold text-white">
                                                received 1 object.
                                            </p>
                                        </div>
                                    </div>
                                ),
                            })
                        }
                        const data = { name: targetName };
                        return [...prevList, data];
                    }
                });
                const currentTime = new Date().getTime();
            }

        }
    }

    const calculateDistance = (position1: Vector3, position2: number[]) => {
        // Extract coordinates from Vector3 instances
        const x1 = position1.x;
        const y1 = position1.y;
        const z1 = position1.z;
        const x2 = position2[0];
        const y2 = position2[1];
        const z2 = position2[2];
        // Calculate the squared differences
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        // Compute the distance
        const distance = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
        // Round to 3 decimal places
        const roundedDistance = Math.round(distance * 1000) / 1000;
        return roundedDistance;
    }

    return (
        <>
            {objectData.map((object, index) => (
                <RigidBody
                    key={object.id}
                    name={object.item.name}
                    lockRotations
                    lockTranslations
                    position={object.rigidBody.position}
                    scale={object.rigidBody.scale}
                    rotation={object.rigidBody.rotation}
                    onCollisionEnter={(other) => handleTargetObjectLaser(other, object.item.name, object.rigidBody.position)}
                    onCollisionExit={(other) => handleTargetObjectLaserExit(other, object.item.name)}
                >
                    <ItemWithOutlineCondition
                        item={object.item}
                        isOutlined={hoverTarget === object.item.name}
                        normalThickness={object.outline?.normalThickness}
                        focusedThickness={object.outline?.focusedThickness}
                        isSpin={object.spin?.isSpin}
                        spinSpeed={object.spin?.spinSpeed}
                        spinAxis={object.spin?.spinAxis}
                    />
                </RigidBody>
            ))}
            {dropedObject && dropedObject.map((object, index) => (
                <RigidBody
                    key={object.id}
                    name={object.item.name}
                    lockRotations
                    lockTranslations={false}
                    position={object.rigidBody.addjustPosition ? object.rigidBody.addjustPosition : object.rigidBody.position}
                    scale={[
                        object.rigidBody.scale[0] / 4,
                        object.rigidBody.scale[1] / 4,
                        object.rigidBody.scale[2] / 4
                    ]}
                    mass={10}
                    rotation={object.rigidBody.rotation}
                    onCollisionEnter={(other) => handlePickUpObject(other, object.item.name)}
                >
                    <ItemDropped
                        item={object.item}
                    />
                </RigidBody>
            ))}
        </>
    );
};

export default LaserTargetObject;
