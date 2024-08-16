import React, { useContext, useEffect, useRef, useState } from 'react'
import { Level5FinalRoom2Map } from '../../map/Level5-Final-Room2-Map'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { Item } from '../../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../../utils'
import BossHologram from './BossHologram'
import { GameContext } from '../../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere, useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'
import EnemyBodyPart from '../../../shared-object/object/EnemyBodyPart'

const Level5Room2Environment = ({

}) => {

    const { currentHit, setCurrentHit, setIsInteracting } = useContext(GameContext);
    const [lastPressTime, setLastPressTime] = useState(0);
    const ePressed = useKeyboardControls((state) => state[Controls.coding]);
    const bossHoloGramRef = useRef<any>(null);

    const waitingPositionRef1 = useRef(null)
    const waitingPositionRef2 = useRef(null)
    const waitingPositionRef3 = useRef(null)

    const [bubbles, setBubbles] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Generate a new bubble with random position and speed
            setBubbles((prevBubbles) => [
                ...prevBubbles,
                {
                    id: Math.random(),
                    position: [
                        (Math.random() - 0.5) * 4, // random x position within the cylinder's radius
                        3, // start below the cylinder
                        (Math.random() - 0.5) * 4, // random z position within the cylinder's radius
                    ],
                    speed: Math.random() * 0.02 + 0.01, // random speed
                },
            ]);
        }, 750); // Adjust the interval for bubble generation frequency

        return () => clearInterval(interval);
    }, []);

    // console.log(bubbles);
    useFrame(() => {
        // console.log(bubbles);
        setBubbles(
            (prevBubbles) =>
                prevBubbles
                    .map((bubble) => ({
                        ...bubble,
                        position: [
                            bubble.position[0],
                            bubble.position[1] - bubble.speed, // move the bubble up
                            bubble.position[2],
                        ],
                    }))
                    .filter((bubble) => bubble.position[1] > -3) // keep bubbles within the cylinder (fade out at the top)
        );
    });

    useFrame(() => {
        if (ePressed && currentHit === "BossHologramComputer") {
            const currentTime = new Date().getTime();
            if (currentTime - lastPressTime > 200) {
                setLastPressTime(currentTime);
                setIsInteracting((prev) => !prev);
            }
        }
    })

    const handleBossHologramComputerColliderEnter = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("BossHologramComputer");
        }
    }

    const handleBossHologramComputerColliderExit = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setCurrentHit("");
        }
    }

    return (
        <>
            <Level5FinalRoom2Map />
            <RigidBody
                name='BossHologramComputer'
                colliders={false}
                type='fixed'
                lockTranslations
                lockRotations
                scale={[200, 200, 200]}
                position={[-7, 0, 6]}
                rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]}
                onCollisionEnter={handleBossHologramComputerColliderEnter}
                onCollisionExit={handleBossHologramComputerColliderExit}>
                <CuboidCollider args={[0.005, 0.024, 0.006]} />
                <Item
                    item={
                        {
                            name: "ScifiComputer",
                            position: [0, 0, 0],
                            scale: [1, 1, 1],
                            rotation: [0, 0, 0],
                            fileType: "glb",
                        }
                    }
                    isOutlined={true}
                    outlineThickness={7}
                />
            </RigidBody>
            <BossHologram bossHoloGramRef={bossHoloGramRef} />
            <EnemyBodyPart
                name='BossArm'
                position={[-17, 6, -9]}
                scale={[0.5, 0.5, 0.5]}
                rotation={[0, degreeNumberToRadian(30), 0]}
                opacity={0.6}
            />
            <EnemyBodyPart
                name='BossHead'
                position={[2, 6, -9]}
                scale={[0.5, 0.5, 0.5]}
                rotation={[0, degreeNumberToRadian(30), 0]}
                opacity={0.6}
            />
            <RigidBody
                ref={waitingPositionRef1}
                colliders={false}
                lockTranslations
                lockRotations
                position={[-17, 1.5, -9]}
                scale={[10, 15, 10]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#00f7ff"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.2}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="white"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>
            <RigidBody
                ref={waitingPositionRef2}
                colliders={false}
                lockTranslations
                lockRotations
                position={[2, 1.5, -9]}
                scale={[10, 15, 10]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#00f7ff"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.2}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="white"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>

            <RigidBody
                ref={waitingPositionRef3}
                colliders={false}
                lockTranslations
                lockRotations
                position={[0, 1.5, 10]}
                scale={[15, 15, 15]}
                rotation={[
                    degreeNumberToRadian(180),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Cylinder
                    scale={[0.05, 0.1, 0.05]}
                    args={[3, 3, 6]}
                    position={[0, -0.3, 0]}
                    rotation={[
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                        degreeNumberToRadian(0),
                    ]}
                >
                    <FakeGlowMaterial
                        glowColor="#3fff69"
                        falloff={2}
                        glowInternalRadius={0}
                        opacity={0.2}
                    />
                    {bubbles.map((bubble) => (
                        <Sphere
                            key={bubble.id}
                            args={[0.175, 16, 16]}
                            position={bubble.position}
                        >
                            <FakeGlowMaterial
                                glowColor="#21c400"
                                falloff={2}
                                glowInternalRadius={0}
                                opacity={0.2}
                            />
                        </Sphere>
                    ))}
                </Cylinder>
                <CylinderCollider args={[0.05, 0.1, 0.05]} />
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [0.1, 0.1, 0.1],
                        fileType: "glb",
                    }}
                />
            </RigidBody>
        </>
    )
}

export default Level5Room2Environment