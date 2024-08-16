import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Level6Room1Map } from '../../map/Level6-Room1-Map'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useLevel6Context } from '../../../../contexts/SceneContext/Level6Context'
import { Cylinder, Sphere, useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../../../controllers/CharacterController'
import MazeWall from './MazeWall'
import MazeSolver from './MazeSolver'
import { Item } from '../../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../../utils'
import { GameContext } from '../../../../contexts/GameContext'
import SmoothCamera from '../../../../controllers/SmoothCamera'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'
import TeleportBar from '../../../shared-object/object/TeleportBar'
import GolemController from '../../../../controllers/GolemController'

const Level6Room1Environment = ({
  generateMaze,
  stepMaze,
}) => {

  const { currentHit, setCurrentHit, setIsInteracting, isUsingSecurityCamera, setIsUsingSecurityCamera } = useContext(GameContext);
  const {
    mazeStateDetail, 
    isMazeSolverStartMoving, 
    setIsMazeSolverStartMoving, 
    isMazeSolverReachEnd, 
    setIsMazeSolverReachEnd, 
    setSolvingTime, 
    setMazeWallReDissolve,
    mazeWallReDissolve, } = useLevel6Context()

  const ePressed = useKeyboardControls((state) => state[Controls.coding])
  const escPressed = useKeyboardControls((state) => state[Controls.ESC])
  const [lastPressTime, setLastPressTime] = useState(0)
  const lastUpdateTimeRef = useRef(Date.now()) // Initialize a ref to track the last update time
  const SolvedSuccessTime = useRef(Date.now())

  // Define the position offset for the entire maze
  const mazePosition = [-55, 0, -30] // Adjust x, y, z as needed
  const mazeSolverStartPosition = [-55, 1, 11]
  const mazeSolverMovingSpeed = 5
  const openPathWidth = 3 // Width of the open paths
  const wallHeight = 10 // Height of the walls

  const waitingPositionRef1 = useRef(null)

  useFrame(() => {
    // console.log(state);
    if (ePressed && currentHit === "ComputerMazeSolver" && isUsingSecurityCamera === false) {
      const currentTime = Date.now()
      if (currentTime - lastPressTime > 200) {
        setLastPressTime(currentTime)
        setIsInteracting((prev) => !prev)
      }
    }

    if (ePressed && currentHit === "ComputerMazeSolver" && isUsingSecurityCamera === true) {
      const currentTime = Date.now()
      if (currentTime - lastPressTime > 200) {
        if (isMazeSolverReachEnd) {
          setLastPressTime(currentTime)
          setIsInteracting(false)
          setCurrentHit("")
          setIsUsingSecurityCamera(false)
          setIsMazeSolverStartMoving(false)
        }
        else {
          setLastPressTime(currentTime)
          setIsInteracting(false)
          setCurrentHit("")
          setIsUsingSecurityCamera(false)
          setIsMazeSolverStartMoving(false)
          setSolvingTime(0)
          generateMaze()
        }
      }
    }

    if (isMazeSolverStartMoving && !isMazeSolverReachEnd) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - lastUpdateTimeRef.current
      if (elapsedTime > 500) { // Check if 1 second has passed
        lastUpdateTimeRef.current = currentTime // Update the last update time
        if (!mazeStateDetail.done) {
          setSolvingTime(prev => prev + 0.5)
          stepMaze()
        } else {
          console.log("Maze is done")
          setIsMazeSolverReachEnd(true)
          SolvedSuccessTime.current = currentTime
        }
      }
    }

    if (isMazeSolverReachEnd) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - SolvedSuccessTime.current
      if (elapsedTime > 5000) {
        SolvedSuccessTime.current = currentTime
        setMazeWallReDissolve(false)
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

  

  return (
    <>
      <Level6Room1Map />

      <group position={mazePosition}>
        <MazeWall
          color="#003f69"
          openPathWidth={openPathWidth}
          wallHeight={wallHeight}
          mazeSolverStartPosition={mazeSolverStartPosition}
          dissolveDuration={3}
          dissolveNoiseScale={0.15}
          dissolveColor="#00c3ff"
          dissolveIntensity={10}
        />
        <MazeSolver
          mazeSolverStartPosition={mazeSolverStartPosition}
          mazeSolverMovingSpeed={mazeSolverMovingSpeed}
          mazePosition={mazePosition}
          openPathWidth={openPathWidth}
        />
      </group>

      <TeleportBar
        teleport1Position={[-67, 20, -28]}
        teleport2Position={[-14, 0, -29]}
        isEnable={isMazeSolverReachEnd}
      />
      <RigidBody
        type="fixed"
        colliders={false}
        lockTranslations
        lockRotations
        position={[-45, 0, 19]}
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
      <RigidBody
        type="fixed"
        colliders="trimesh"
        lockTranslations
        lockRotations
        position={[-65, 20, -25]}
        scale={[500, 500, 500]}
        rotation={[
          degreeNumberToRadian(90),
          degreeNumberToRadian(180),
          degreeNumberToRadian(-180),
        ]}
        onCollisionEnter={handleEnterComputerVideo}
        onCollisionExit={handleExitComputerVideo}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            scale: [1, 1, 1],
            fileType: "glb",
          }}
          isOutlined={true}
          outlineThickness={2}
        />
      </RigidBody>

      <GolemController
        position={[-2, ((isMazeSolverReachEnd && !mazeWallReDissolve) ? 1 : 2.5), 24]}
        rotation={[0, degreeNumberToRadian(0), 0]}
        activeMoving={(isMazeSolverReachEnd && !mazeWallReDissolve)}
        // activeMoving={true}
      />
      <RigidBody
        ref={waitingPositionRef1}
        colliders={false}
        lockTranslations
        lockRotations
        position={[-2, 0, 24]}
        scale={[24, 17, 24]}
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
            glowColor="#02eeff"
            falloff={2}
            glowInternalRadius={0}
            opacity={0.6}
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
      <GolemController
        position={[-65, ((isMazeSolverReachEnd && !mazeWallReDissolve) ? 1 : 2.5), 24]}
        rotation={[0, degreeNumberToRadian(0), 0]}
        activeMoving={(isMazeSolverReachEnd && !mazeWallReDissolve)}
        // activeMoving={true}
      />
      <RigidBody
        ref={waitingPositionRef1}
        colliders={false}
        lockTranslations
        lockRotations
        position={[-65, 0, 24]}
        scale={[24, 17, 24]}
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
            glowColor="#02eeff"
            falloff={2}
            glowInternalRadius={0}
            opacity={0.6}
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
    </>
  )
}

export default Level6Room1Environment
