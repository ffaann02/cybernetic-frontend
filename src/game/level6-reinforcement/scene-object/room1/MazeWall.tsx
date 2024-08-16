import { CuboidCollider, RigidBody } from '@react-three/rapier'
import React, { useContext, useMemo, useRef, useState } from 'react'
import { useLevel6Context } from '../../../../contexts/SceneContext/Level6Context'
import * as THREE from 'three'
import { DissolveMaterial } from '../../../../components/DissolveMaterial';
import { Cylinder } from '@react-three/drei';
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial';
import { degreeNumberToRadian } from '../../../../utils';
import { EffectComposer } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import { GameContext } from '../../../../contexts/GameContext';

const MazeWall = ({
    color,
    openPathWidth,
    wallHeight,
    mazeSolverStartPosition,
    dissolveDuration,
    dissolveNoiseScale,
    dissolveColor,
    dissolveIntensity,
}) => {

    const { setEnergy } = useContext(GameContext);
    const { mazeGeneratedPattern, mazeWallReDissolve, isMazeSolverReachEnd } = useLevel6Context();
    const timeRef = useRef(0); // Reference to keep track of time
    const [laserOpacity, setLaserOpacity] = useState(2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: color });

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
                                {/* <meshStandardMaterial color={color} /> */}
                                <DissolveMaterial
                                    baseMaterial={boxMaterial}
                                    visible={!isMazeSolverReachEnd}
                                    color={dissolveColor}
                                    duration={dissolveDuration}
                                    intensity={dissolveIntensity}
                                    noiseScale={dissolveNoiseScale}
                                />
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
                        <DissolveMaterial
                            baseMaterial={boxMaterial}
                            visible={!isMazeSolverReachEnd}
                            color={dissolveColor}
                            duration={dissolveDuration}
                            intensity={dissolveIntensity}
                            noiseScale={dissolveNoiseScale}
                        />
                    </mesh>
                </RigidBody>
            )
            // Bottom outer wall
            // Open path for entrance
            if (x !== 0) {
                wallElements.push(
                    <RigidBody key={`bottom-outer-${x}`} type="fixed">
                        <mesh position={[x * openPathWidth, wallHeight / 2, numRows * openPathWidth]}>
                            <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                            <DissolveMaterial
                                baseMaterial={boxMaterial}
                                visible={!isMazeSolverReachEnd}
                                color={dissolveColor}
                                duration={dissolveDuration}
                                intensity={dissolveIntensity}
                                noiseScale={dissolveNoiseScale}
                            />
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
                        <DissolveMaterial
                            baseMaterial={boxMaterial}
                            visible={!isMazeSolverReachEnd}
                            color={dissolveColor}
                            duration={dissolveDuration}
                            intensity={dissolveIntensity}
                            noiseScale={dissolveNoiseScale}
                        />
                    </mesh>
                </RigidBody>
            )
            // Right outer wall
            wallElements.push(
                <RigidBody key={`right-outer-${z}`} type="fixed">
                    <mesh position={[numCols * openPathWidth, wallHeight / 2, z * openPathWidth]}>
                        <boxGeometry args={[openPathWidth, wallHeight, openPathWidth]} />
                        <DissolveMaterial
                            baseMaterial={boxMaterial}
                            visible={!isMazeSolverReachEnd}
                            color={dissolveColor}
                            duration={dissolveDuration}
                            intensity={dissolveIntensity}
                            noiseScale={dissolveNoiseScale}
                        />
                    </mesh>
                </RigidBody>
            )
        }

        return wallElements
    }, [mazeGeneratedPattern, color, openPathWidth, wallHeight, isMazeSolverReachEnd])

    useFrame((state, delta) => {
        timeRef.current += delta; // Increment time

        const opacity = 3 + 1 * Math.sin(timeRef.current * 8); // Sine wave calculation for smooth oscillation
        setLaserOpacity(opacity);
    })

    const handlePlayerCollisionLaser = ({ other }) => {
        const { name } = other.rigidBodyObject;
        if (name === "player") {
            setEnergy(0)
        }
    }

    return (
        <>
            {mazeWallReDissolve &&
                <>
                    {mazeWalls}
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 3, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 4, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />

                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 5, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />

                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 6, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 7, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 8, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 9, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                    <RigidBody
                        name="LaserWall"
                        type="fixed"
                        colliders="trimesh"
                        position={[4, 10, 45]}
                        rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
                        scale={[0.1, 1, 0.1]}
                        lockRotations
                        lockTranslations
                        onCollisionEnter={handlePlayerCollisionLaser}
                    >
                        <Cylinder args={[2, 2, 5, 32]} position={[10, 4, 20]}>
                            <meshStandardMaterial color={"red"} transparent opacity={laserOpacity} />
                        </Cylinder>
                    </RigidBody>
                </>
            }
        </>
    )
}

export default MazeWall
