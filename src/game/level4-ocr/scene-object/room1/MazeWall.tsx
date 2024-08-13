import { RigidBody } from '@react-three/rapier'
import React, { useMemo } from 'react'
import { useLevel6Context } from '../../../../contexts/SceneContext/Level6Context'

const MazeWall = ({
    color,
    openPathWidth,
    wallHeight,
}) => {

    const { mazeGeneratedPattern } = useLevel6Context();

    const mazeWalls = useMemo(() => {
        if (!mazeGeneratedPattern) return null

        const wallElements = []
        const numRows = mazeGeneratedPattern.length
        const numCols = mazeGeneratedPattern[0]?.length || 0

        mazeGeneratedPattern.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    wallElements.push(
                        <RigidBody key={`inner-${x}-${z}`} type="fixed">
                            <mesh position={[x * openPathWidth, wallHeight / 2, z * openPathWidth]}>
                                <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                        </RigidBody>
                    )
                }
            })
        })

        // Add outer walls
        for (let x = -1; x <= numCols; x++) {
            // Top outer wall
            wallElements.push(
                <RigidBody key={`top-outer-${x}`} type="fixed">
                    <mesh position={[x * openPathWidth, wallHeight / 2, -openPathWidth]}>
                        <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </RigidBody>
            )
            // Bottom outer wall
            // Open path for entrance
            if(x !== 0){ 
                wallElements.push(
                    <RigidBody key={`bottom-outer-${x}`} type="fixed">
                        <mesh position={[x * openPathWidth, wallHeight / 2, numRows * openPathWidth]}>
                            <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    </RigidBody>
                )
            }
        }

        for (let z = 0; z <= numRows; z++) {
            // Left outer wall
            wallElements.push(
                <RigidBody key={`left-outer-${z}`} type="fixed">
                    <mesh position={[-openPathWidth, wallHeight / 2, z * openPathWidth]}>
                        <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </RigidBody>
            )
            // Right outer wall
            wallElements.push(
                <RigidBody key={`right-outer-${z}`} type="fixed">
                    <mesh position={[numCols * openPathWidth, wallHeight / 2, z * openPathWidth]}>
                        <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </RigidBody>
            )
        }

        return wallElements
    }, [mazeGeneratedPattern, color, openPathWidth, wallHeight])

    return (
        <>
            {mazeWalls}
        </>
    )
}

export default MazeWall
