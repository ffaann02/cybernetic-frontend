import { Cylinder, useKeyboardControls } from '@react-three/drei'
import { CuboidCollider, RigidBody, vec3 } from '@react-three/rapier'
import React, { useContext, useRef, useState } from 'react'
import FakeGlowMaterial from '../../../components/FakeGlowMaterial'
import { degreeNumberToRadian } from '../../../utils'
import { Item } from './Item'
import { GameContext } from '../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import { Controls } from '../../../controllers/CharacterController'

interface Props {
    teleport1Position: number[]
    teleport2Position: number[]
    isEnable: boolean
}

const TeleportBar: React.FC<Props> = ({
    teleport1Position,
    teleport2Position,
    isEnable,
}) => {

    const { playerRigidBody, currentHit, setCurrentHit } = useContext(GameContext);
    const ePressed = useKeyboardControls((state) => state[Controls.coding])
    const [lastPressTime, setLastPressTime] = useState(0)

    const floor2 = useRef();
    const floor1 = useRef();

    const onPlayerEnterTeleport1 = ({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
            setCurrentHit("Teleport1");
        }
    };

    const onPlayerExitTeleport1 = ({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
            setCurrentHit("");
        }
    };

    const onPlayerEnterTeleport2 = ({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
            setCurrentHit("Teleport2");
        }
    };

    const onPlayerExitTeleport2 = ({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
            setCurrentHit("");
        }
    };

    useFrame(() => {
        const currentTime = new Date().getTime();
        if (ePressed && currentTime - lastPressTime > 200) {
          if (currentHit === "Teleport1") {
            if (floor1.current && playerRigidBody.current) {
                if(isEnable === true){
                    const destinationPosition = vec3(floor1.current.translation());
                    playerRigidBody.current.setTranslation(destinationPosition, true);
                    console.log("teleport up");
                    setCurrentHit("");
                }
                else{
                    console.log("teleport disabled")
                }
            } else {
              console.error("Destination object or rigidBody ref not found");
            }
          }
          if (currentHit === "Teleport2") {
            if (floor2.current && playerRigidBody.current) {
                if(isEnable === true){
                    const destinationPosition = vec3(floor2.current.translation());
                    playerRigidBody.current.setTranslation(destinationPosition, true);
                    console.log("teleport down");
                    setCurrentHit("");
                }
                else {
                    console.log("teleport disabled")
                }
            } else {
              console.error("Destination object or rigidBody ref not found");
            }
          }
          setLastPressTime(currentTime);
        }
    })

    return (
        <>
            <RigidBody
                name="Teleport1"
                type="fixed"
                colliders={false}
                position={teleport1Position}
                scale={[1, 1, 1]}
                lockRotations
                lockTranslations
                onCollisionEnter={onPlayerEnterTeleport2}
                onCollisionExit={onPlayerExitTeleport2}
            >
                <CuboidCollider args={[1, 0.04, 1]} position={[0, 1.5, 0]} />
                <Cylinder args={[2, 2, 6, 32]} position={[0, 4, 0]}>
                    <meshStandardMaterial color={isEnable === true ?"green" : "red"} transparent opacity={0.4} />
                    <FakeGlowMaterial
                        glowInternalRadius={0.1}
                        glowColor={isEnable === true ?"green" : "red"}
                        falloff={2}
                        opacity={0.8}
                        glowSharpness={0}
                        side="THREE.FrontSide"
                    />
                </Cylinder>
            </RigidBody>
            <RigidBody
                type="fixed"
                colliders={"trimesh"}
                position={teleport1Position}
                scale={[1, 1, 1]}
                lockRotations
                lockTranslations
                rotation={[
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        scale: [1, 1, 1],
                        rotation: [
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ],
                        fileType: "glb",
                    }}
                    isOutlined
                    outlineColor={isEnable === true ?"green" : "red"}
                    outlineThickness={3}
                />
            </RigidBody>
            <RigidBody
                name="Teleport2"
                type="fixed"
                colliders={false}
                position={teleport2Position}
                scale={[1, 1, 1]}
                lockRotations
                lockTranslations
                onCollisionEnter={onPlayerEnterTeleport1}
                onCollisionExit={onPlayerExitTeleport1}
            >
                <CuboidCollider args={[1, 0.04, 1]} position={[0, 1.5, 0]} />
                <Cylinder args={[2, 2, 5, 32]} position={[0, 4, 0]}>
                    <meshStandardMaterial color={isEnable === true ?"green" : "red"} transparent opacity={0.4} />
                    <FakeGlowMaterial
                        glowInternalRadius={0.1}
                        glowColor={isEnable === true ?"green" : "red"}
                        falloff={2}
                        opacity={0.8}
                        glowSharpness={0}
                        side="THREE.FrontSide"
                    />
                </Cylinder>
            </RigidBody>
            <RigidBody
                type="fixed"
                colliders={"trimesh"}
                position={teleport2Position}
                scale={[1, 1, 1]}
                lockRotations
                lockTranslations
                rotation={[
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                    degreeNumberToRadian(0),
                ]}
            >
                <Item
                    item={{
                        name: "PortalPad",
                        position: [0, 0, 0],
                        scale: [1, 1, 1],
                        rotation: [
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                            degreeNumberToRadian(0),
                        ],
                        fileType: "glb",
                    }}
                    isOutlined
                    outlineColor={isEnable === true ?"green" : "red"}
                    outlineThickness={3}
                />
            </RigidBody>
            <RigidBody
                ref={floor1}
                lockTranslations
                lockRotations
                position={teleport1Position}
            ></RigidBody>
            <RigidBody
                ref={floor2}
                lockTranslations
                lockRotations
                position={teleport2Position}
            ></RigidBody>
        </>
    )
}

export default TeleportBar