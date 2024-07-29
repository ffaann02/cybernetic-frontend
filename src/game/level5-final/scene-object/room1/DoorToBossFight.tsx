import { RigidBody, vec3 } from '@react-three/rapier'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { GameContext } from '../../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'

const DoorToBossFight = ({
  leftDoorToBossFightRef,
  rightDoorToBossFightRef,
  isDoorOpenned,
  setIsDoorOpenned,
  isDoorOpening,
  setIsDoorOpening,
  isDoorClosing,
  setIsDoorClosing,
  isDoorClosed,
  setIsDoorClosed,
  doorOpacity,
}) => {

  const { setCurrentHit } = useContext(GameContext);
  const [leftDoorPosition, setLeftDoorPosition] = useState([-50, 14, 8]);
  const [rightDoorPosition, setRightDoorPosition] = useState([-5, 14, 8]);

  const handleDoorToBossFightonCollisionEnter = ({ other }) => {
    const { name } = other.rigidBodyObject;
    if (name === 'player') {
      setCurrentHit("DoorToBossFight");
    }
  }

  const handleDoorToBossFightonCollisionExit = ({ other }) => {
    const { name } = other.rigidBodyObject;
    if (name === 'player') {
      setCurrentHit("");
    }
  }

  const doorMoveSpeed = 0.1;

  useFrame(() => {
    if (leftDoorToBossFightRef && leftDoorToBossFightRef.current && rightDoorToBossFightRef && rightDoorToBossFightRef.current) {
      const currentLeftDoorPosition = vec3(leftDoorToBossFightRef.current.translation());
      const currentRightDoorPosition = vec3(rightDoorToBossFightRef.current.translation());
      if (isDoorClosed && isDoorOpening) {
        if (currentLeftDoorPosition.x > -85) {
          leftDoorToBossFightRef.current.setTranslation({
            x: currentLeftDoorPosition.x - doorMoveSpeed,
            y: currentLeftDoorPosition.y,
            z: currentLeftDoorPosition.z
          });
        }
        if (currentRightDoorPosition.x < 30) {
          rightDoorToBossFightRef.current.setTranslation({
            x: currentRightDoorPosition.x + doorMoveSpeed,
            y: currentRightDoorPosition.y,
            z: currentRightDoorPosition.z
          });
        }
        if (currentLeftDoorPosition.x <= -85 && currentRightDoorPosition.x >= 30) {
          setIsDoorOpening(false);
          setIsDoorOpenned(true);
          setIsDoorClosing(true);
        }
      }
      else if (isDoorOpenned && isDoorClosing) {
        if (currentLeftDoorPosition.x < -50) {
          leftDoorToBossFightRef.current.setTranslation({
            x: currentLeftDoorPosition.x + doorMoveSpeed,
            y: currentLeftDoorPosition.y,
            z: currentLeftDoorPosition.z
          });
        }
        if (currentRightDoorPosition.x > -5) {
          rightDoorToBossFightRef.current.setTranslation({
            x: currentRightDoorPosition.x - doorMoveSpeed,
            y: currentRightDoorPosition.y,
            z: currentRightDoorPosition.z
          });
        }
        if (currentLeftDoorPosition.x >= -50 && currentRightDoorPosition.x <= -5) {
          setIsDoorClosing(false);
          setIsDoorClosed(true);
        }
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
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}
          onCollisionExit={handleDoorToBossFightonCollisionExit}>
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <FakeGlowMaterial glowColor="#00fff2" opacity={doorOpacity} />
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
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}
          onCollisionExit={handleDoorToBossFightonCollisionExit}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            {/* <meshBasicMaterial color="#00fff2" transparent opacity={0.7} /> */}
            <FakeGlowMaterial glowColor="#00fff2" opacity={doorOpacity} />
          </mesh>
        </RigidBody>
      )}

    </>
  )
}

export default DoorToBossFight;
