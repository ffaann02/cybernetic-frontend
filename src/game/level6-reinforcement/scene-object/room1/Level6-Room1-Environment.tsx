import React, { useContext, useMemo, useState } from 'react'
import { Level6Room1Map } from '../../map/Level6-Room1-Map'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useLevel6Context } from '../../../../contexts/SceneContext/Level6Context'
import { useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'
import MazeWall from './MazeWall'
import MazeSolver from './MazeSolver'
import { Item } from '../../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../../utils'
import { GameContext } from '../../../../contexts/GameContext'
import SmoothCamera from '../../../../controllers/SmoothCamera'

const Level6Room1Environment = ({
  generateMaze,
  stepMaze,
}) => {

  const { currentHit, setCurrentHit, setIsInteracting, isUsingSecurityCamera } = useContext(GameContext);
  const { mazeStateDetail, isMazeSolverStartMoving, isMazeSolverReachEnd, setIsMazeSolverReachEnd } = useLevel6Context()

  const ePressed = useKeyboardControls((state) => state[Controls.coding])
  const [lastPressTime, setLastPressTime] = useState(0)

  // Define the position offset for the entire maze
  const mazePosition = [-55, 0, -30] // Adjust x, y, z as needed
  const mazeSolverStartPosition = [-55, 1, 11]
  const mazeSolverMovingSpeed = 5
  const openPathWidth = 3 // Width of the open paths
  const wallHeight = 10 // Height of the walls

  useFrame(() => {
    if (ePressed && currentHit === "ComputerMazeSolver") {
      const currentTime = Date.now()
      if (currentTime - lastPressTime > 200) {
        setLastPressTime(currentTime)
        setIsInteracting((prev) => !prev)
        // stepMaze()
      }
    }

    if(isMazeSolverStartMoving === true && isMazeSolverReachEnd === false) {
      const currentTime = Date.now()
      if (currentTime - lastPressTime > 500) {
        if(mazeStateDetail.done === false){
          setLastPressTime(currentTime)
          stepMaze()
        }
        else if(mazeStateDetail.done === true){
          console.log("Maze is done")
          setIsMazeSolverReachEnd(true)
        }
      }
    }
  })

  const handleEnterComputerVideo = ({ other }) => {
    const { name } = other.rigidBodyObject;
    if (name === "player") {
      setCurrentHit("ComputerMazeSolver")
    }
  }

  const handleExitComputerVideo = ({ other }) => {
    const { name } = other.rigidBodyObject;
    if (name === "player") {
      setCurrentHit("")
    }
  }

  return (
    <>
      <Level6Room1Map />
      {isUsingSecurityCamera &&
        <SmoothCamera
          targetPosition={[-32, 65, 5]}
          rotation={[
            degreeNumberToRadian(-80),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]} />
      }
      <group position={mazePosition}>
        <MazeWall
          color="grey"
          openPathWidth={openPathWidth}
          wallHeight={wallHeight}
        />
        <MazeSolver
          mazeSolverStartPosition={mazeSolverStartPosition}
          mazeSolverMovingSpeed={mazeSolverMovingSpeed}
          mazePosition={mazePosition}
          openPathWidth={openPathWidth}
        />
      </group>
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-34, 0, 32]}
        scale={[500, 500, 500]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(-180),
        ]}
        onCollisionEnter={handleEnterComputerVideo}
        onCollisionExit={handleExitComputerVideo}
      >
        <CuboidCollider
          args={[0.002, 0.003, 0.005]}
          position={[0, 0, 0.006]}
          rotation={[
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        />
        <Item
          item={{
            name: "ComputerVideo",
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

export default Level6Room1Environment
