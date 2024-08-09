import React, { memo, useContext, useRef, useState } from 'react'
import {
    Environment,
    OrbitControls,
    useKeyboardControls,
} from "@react-three/drei";
import { GameContext } from '../../../contexts/GameContext';
import Level6Room1Environment from './room1/Level6-Room1-Environment';

export const Room = memo(({ children }) => {
    return <>{children}</>;
});

export const Level6Environment = ({
    generateMaze,
    stepMaze,
}) => {

    const { playerRigidBody } = useContext(GameContext);

    const [currentRoom, setCurrentRoom] = useState(1);

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
                    <Level6Room1Environment
                        generateMaze={generateMaze}
                        stepMaze={stepMaze} />
                </Room>)}
        </>
    )
}