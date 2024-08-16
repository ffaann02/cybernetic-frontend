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
import { Item } from '../../shared-object/object/Item';
import { useFrame } from '@react-three/fiber';
import { useLevel6Context } from '../../../contexts/SceneContext/Level6Context';
import { Mine } from '../../shared-object/object/Mine';

export const Room = memo(({ children }) => {
    return <>{children}</>;
});

export const Level6Environment = ({
    generateMaze,
    stepMaze,
}) => {

    const { playerRigidBody, setCurrentHit, setIsShowLevelResult, setPlayTimeInLevel, mines, setMines } = useContext(GameContext);
    const { lastUpdateTimeRef, level6PlayTime, setLevel6PlayTime } = useLevel6Context();

    const [currentRoom, setCurrentRoom] = useState(1);

    const door01_destination = useRef<any>(null);
    const door02_destination = useRef<any>(null);

    useFrame(() => {
        const currentTimer = Date.now();
        if (lastUpdateTimeRef.current !== null) {
            const deltaTime = currentTimer - lastUpdateTimeRef.current;
            if (deltaTime > 500) {
                lastUpdateTimeRef.current = currentTimer // Update the last update time
                setLevel6PlayTime((prev) => prev + 0.5);
            }
        }
    })

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

            {mines.map((mine, index) => (
                <Mine mine={mine} index={index} setMines={setMines} />
            ))}


            {currentRoom === 1 && (
                <Room>
                    <RigidBody
                        colliders="trimesh"
                        mass={0}
                        type="fixed"
                        name="secure-door-next-level"
                        position={[-70, 20, -24]}
                        rotation={[
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ]}
                        scale={[2, 3, 3]}
                        onCollisionEnter={({ other }) => {
                            if (
                                other.rigidBodyObject &&
                                other.rigidBodyObject.name === "player"
                            ) {
                                // console.log("hello");
                                setPlayTimeInLevel(level6PlayTime);
                                setIsShowLevelResult(true);
                            }
                        }}
                        onCollisionExit={({ other }) => {
                            setCurrentHit("");
                            // setIsShowLevelResult(false);
                        }}
                    >
                        <mesh position={[0, 1.1, 0]}>
                            <boxGeometry args={[0.3, 2, 0.9]} />
                            <meshStandardMaterial
                                color={"green"}
                                transparent={true}
                                opacity={0.5}
                            />
                        </mesh>
                        <Item
                            item={{
                                name: "door-border",
                                position: [0, 0, 0],
                                fileType: "glb",
                            }}
                            isOutlined={true}
                        />
                    </RigidBody>
                    <Level6Room1Environment
                        generateMaze={generateMaze}
                        stepMaze={stepMaze} />
                </Room>)}

            {/* <RigidBody
                name="destination-from-door01"
                colliders="trimesh"
                type="fixed"
                position={[-100, 0, -40]}
                ref={door01_destination}
            ></RigidBody> */}
        </>
    )
}