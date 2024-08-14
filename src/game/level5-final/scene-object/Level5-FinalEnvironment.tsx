import React, { memo, useContext, useRef, useState } from 'react'
import {
    Environment,
    OrbitControls,
    useKeyboardControls,
} from "@react-three/drei";
import Level5Room1Environment from './room1/Level5Room1Environment';
import Door from '../../shared-object/object/Door';
import { degreeNumberToRadian } from '../../../utils';
import { GameContext } from '../../../contexts/GameContext';
import { RigidBody } from '@react-three/rapier';
import Level5Room2Environment from './room2/Level5Room2Environment';
import { useLevel5Context } from '../../../contexts/SceneContext/Level5Context';

export const Room = memo(({ children }) => {
    return <>{children}</>;
});

export const Level5FinalEnvironment = ({}) => {

    const { playerRigidBody } = useContext(GameContext);
    const {
        bossActionDuration,
        setBossChargingCountDown,
        setBossActionState,
        bossHealth,
        setBossHealth,
        BossAttackPatternPredictModel,
        setPredictionStat,
    } = useLevel5Context();

    const [currentRoom, setCurrentRoom] = useState(1);

    const door01_destination = useRef<any>(null);
    const door02_destination = useRef<any>(null);

    return (
        <>
            <Environment preset="dawn" environmentIntensity={0.5} />
            <directionalLight
                intensity={4}
                scale={100}
                castShadow
                shadow-mapSize-height={4096 * 3}
                shadow-mapSize-width={4096 * 3}
                rotation={[0, 0, 0]}
                position={[-2, 8, 2]}
                shadow-camera-left={-20}
                shadow-camera-right={40}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />

            {currentRoom === 1 && (
                <Room>
                    <Door
                        doorname="door01-to-room2"
                        destinationObject={door01_destination}
                        rigidBody={playerRigidBody}
                        position={[10, 0, 28]}
                        rotation={[
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                        status={"open"}
                        type="switch-room"
                        setCurrentRoom={setCurrentRoom}
                        nextRoom={2}
                    />
                    <Level5Room1Environment />
                </Room>)}

            <RigidBody
                name="destination-from-door01"
                colliders="trimesh"
                type="fixed"
                position={[-18, 0, 12]}
                ref={door01_destination}
            ></RigidBody>

            <RigidBody
                name="destination-from-door02"
                colliders="trimesh"
                type="fixed"
                position={[6, 0, 28]}
                ref={door02_destination}
            ></RigidBody>

            {currentRoom === 2 && (
                <Room>
                    <Door
                        doorname="door02-to-room1"
                        destinationObject={door02_destination}
                        rigidBody={playerRigidBody}
                        position={[-22, 0, 12]}
                        rotation={[
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                        status={"open"}
                        type="switch-room"
                        setCurrentRoom={setCurrentRoom}
                        nextRoom={1}
                    />
                    <Level5Room2Environment />
                </Room>
            )}
        </>
    )
}