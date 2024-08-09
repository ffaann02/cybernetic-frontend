import React, { useMemo, useRef } from 'react'
import { useLevel6Context } from '../../../../contexts/SceneContext/Level6Context'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'
import { Sphere } from '@react-three/drei'
import { degreeNumberToRadian } from '../../../../utils'
import { Item } from '../../../shared-object/object/Item'

const MazeSolver = ({
    mazeSolverStartPosition,
    mazeSolverMovingSpeed,
    mazePosition,
    openPathWidth
}) => {
    const { mazeStateDetail } = useLevel6Context()
    const ref = useRef<any>(null)
    const arrowRef = useRef<any>(null)

    // Calculate the target position based on the current state and maze position
    const targetPosition = useMemo(() => {
        if (!mazeStateDetail || !mazeStateDetail.state) {
            console.log("No maze state detail")
            return mazeSolverStartPosition
        }

        const x = mazeStateDetail.state[0]
        const z = mazeStateDetail.state[1]

        // Add mazePosition offset to the calculated position
        return [
            mazePosition[0] + x * openPathWidth,
            mazePosition[1] + 1, // Adjust y for the box height
            mazePosition[2] + z * openPathWidth
        ]
    }, [mazeStateDetail, openPathWidth, mazePosition])

    const updateArrowPosition = () => {
        if (!arrowRef.current) return

        const targetPosition = ref.current.translation()
        const currentPosition = arrowRef.current.translation()

        // Calculate the direction and velocity
        const velocityX = targetPosition.x - currentPosition.x
        const velocityZ = targetPosition.z - currentPosition.z

        arrowRef.current.setLinvel(
            {
                x: velocityX * mazeSolverMovingSpeed,
                y: 0,
                z: velocityZ * mazeSolverMovingSpeed
            },
            true
        )
    }


    useFrame(() => {
        if (!ref.current) return

        const currentPosition = ref.current.translation()
        const [targetX, targetY, targetZ] = targetPosition

        // Calculate the direction and velocity
        const velocityX = targetX - currentPosition.x
        const velocityY = targetY - currentPosition.y
        const velocityZ = targetZ - currentPosition.z

        ref.current.setLinvel(
            {
                x: velocityX * mazeSolverMovingSpeed,
                y: velocityY * mazeSolverMovingSpeed,
                z: velocityZ * mazeSolverMovingSpeed
            },
            true
        )

        updateArrowPosition()
    })

    return (
        <>
            <RigidBody
                ref={ref}
                lockTranslations
                lockRotations
                colliders={false}
                type="dynamic"
                position={[0, 0, 0]}// Initial position
            >
                <mesh>
                    <boxGeometry args={[1, 2, 1]} /> {/* Box size: width, height, depth */}
                    <meshStandardMaterial color="red" />
                </mesh>
                <Sphere args={[5]}>
                    <FakeGlowMaterial
                        opacity={0.2}
                        falloff={2}
                        glowInternalRadius={1}
                    />
                </Sphere>
            </RigidBody>
            <RigidBody
                ref={arrowRef}
                type="dynamic"
                colliders={false}
                lockTranslations
                lockRotations
                position={[0, 20, 0]}
                scale={[1, 1, 1]}
                rotation={[
                    degreeNumberToRadian(90),
                    degreeNumberToRadian(45),
                    degreeNumberToRadian(0),
                ]}
            >
                <Item
                    item={{
                        name: "Arrow",
                        position: [0, 0, 0],
                        scale: [1, 1, 1],
                        fileType: "glb",
                    }}
                    isOutlined={true}
                    outlineThickness={2}
                />
            </RigidBody>
        </>
    )
}

export default MazeSolver
