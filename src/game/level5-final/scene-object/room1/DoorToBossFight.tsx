import { RigidBody } from '@react-three/rapier'
import React, { useContext, useState, useEffect } from 'react'
import { GameContext } from '../../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'

const DoorToBossFight = ({
  leftDoorToBossFightRef,
  rightDoorToBossFightRef,
  isOpenDoor,
}) => {
  const { setCurrentHit } = useContext(GameContext);
  const [leftDoorPosition, setLeftDoorPosition] = useState([-50, 14, 5]);
  const [rightDoorPosition, setRightDoorPosition] = useState([-5, 14, 5]);

  const handleDoorToBossFightonCollisionEnter = ({ other }) => {
    const { name } = other.rigidBodyObject;
    if (name === 'player') {
      setCurrentHit("DoorToBossFight");
    }
  }

  useFrame(() => {
    if (isOpenDoor) {
      if (leftDoorPosition && leftDoorPosition[0] > -85) {
        setLeftDoorPosition([leftDoorPosition[0] - 0.1, 14, 5]);
      } else {
        setLeftDoorPosition(null); // Remove the door once it reaches the wall
      }

      if (rightDoorPosition && rightDoorPosition[0] < 30) {
        setRightDoorPosition([rightDoorPosition[0] + 0.1, 14, 5]);
      } else {
        setRightDoorPosition(null); // Remove the door once it reaches the wall
      }
    }
  });

  return (
    <>
      {leftDoorPosition && (
        <RigidBody
          ref={leftDoorToBossFightRef}
          name='Left-DoorToBossFight'
          type='fixed'
          lockTranslations
          lockRotations
          position={leftDoorPosition}
          scale={[45, 30, 1]}
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}>
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <FakeGlowMaterial glowColor="#00fff2" opacity={0.6} />
          </mesh>
        </RigidBody>
      )}
      {rightDoorPosition && (
        <RigidBody
          ref={rightDoorToBossFightRef}
          name='Right-DoorToBossFight'
          type='fixed'
          lockTranslations
          lockRotations
          position={rightDoorPosition}
          scale={[45, 30, 1]}
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            {/* <meshBasicMaterial color="#00fff2" transparent opacity={0.7} /> */}
            <FakeGlowMaterial glowColor="#00fff2" opacity={0.6} />
          </mesh>
        </RigidBody>
      )}
    </>
  )
}

export default DoorToBossFight;
