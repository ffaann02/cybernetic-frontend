import React, { memo, useContext, useRef, useState } from 'react'
import {
    Environment,
    OrbitControls,
    useKeyboardControls,
} from "@react-three/drei";
import { GameContext } from '../../../contexts/GameContext';
import Level6Room1Environment from './room1/Level6-Room1-Environment';
import Door from '../../shared-object/object/Door';
import { degreeNumberToRadian } from '../../../utils';
import { RigidBody } from '@react-three/rapier';

export const Room = memo(({ children }) => {
    return <>{children}</>;
});

export const Level6Environment = ({
    generateMaze,
    stepMaze,
}) => {

    const { playerRigidBody } = useContext(GameContext);

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
                        position={[-70, 20, -24]}
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
                    <Level6Room1Environment
                        generateMaze={generateMaze}
                        stepMaze={stepMaze} />
                </Room>)}

            <RigidBody
                name="destination-from-door01"
                colliders="trimesh"
                type="fixed"
                position={[-100, 0, -40]}
                ref={door01_destination}
            ></RigidBody>
        </>
    )
}