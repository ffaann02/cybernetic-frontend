import { RigidBody, vec3 } from '@react-three/rapier'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { GameContext } from '../../../../contexts/GameContext'
import { useFrame } from '@react-three/fiber'
import FakeGlowMaterial from '../../../../components/FakeGlowMaterial'
import { Item } from '../../../shared-object/object/Item'
import { degreeNumberToRadian } from '../../../../utils'

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
  const [leftDoorPosition, setLeftDoorPosition] = useState([-27.5, 28, 7.5]);
  const [rightDoorPosition, setRightDoorPosition] = useState([-27.5, 0, 7.5]);
  // const [leftDoorPosition, setLeftDoorPosition] = useState([-50, 28, 7.5]);
  // const [rightDoorPosition, setRightDoorPosition] = useState([-10, 0, 7.5]);

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
        if (currentLeftDoorPosition.x > -60) {
          leftDoorToBossFightRef.current.setTranslation({
            x: currentLeftDoorPosition.x - doorMoveSpeed,
            y: currentLeftDoorPosition.y,
            z: currentLeftDoorPosition.z
          });
        }
        if (currentRightDoorPosition.x < 5) {
          rightDoorToBossFightRef.current.setTranslation({
            x: currentRightDoorPosition.x + doorMoveSpeed,
            y: currentRightDoorPosition.y,
            z: currentRightDoorPosition.z
          });
        }
        if (currentLeftDoorPosition.x <= -60 && currentRightDoorPosition.x >= 5) {
          setIsDoorOpening(false);
          setIsDoorOpenned(true);
          setIsDoorClosing(true);
        }
      }
      else if (isDoorOpenned && isDoorClosing) {
        if (currentLeftDoorPosition.x < -27.5) {
          leftDoorToBossFightRef.current.setTranslation({
            x: currentLeftDoorPosition.x + doorMoveSpeed,
            y: currentLeftDoorPosition.y,
            z: currentLeftDoorPosition.z
          });
        }
        if (currentRightDoorPosition.x > -27.5) {
          rightDoorToBossFightRef.current.setTranslation({
            x: currentRightDoorPosition.x - doorMoveSpeed,
            y: currentRightDoorPosition.y,
            z: currentRightDoorPosition.z
          });
        }
        if (currentLeftDoorPosition.x >= -27.5 && currentRightDoorPosition.x <= -27.5) {
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
          rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(0), degreeNumberToRadian(90)]}
          scale={[10, 28, 10]}
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}
          onCollisionExit={handleDoorToBossFightonCollisionExit}>
          {/* <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <FakeGlowMaterial glowColor="#00fff2" opacity={doorOpacity} />
          </mesh> */}
          <Item
            item={
              {
                name: "MetalDoor",
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
                fileType: "glb",
              }
            }
            isOutlined={true}
            outlineColor={"#ff1e00"}
            outlineThickness={3}
            visible={doorOpacity > 0} 
          />
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
          rotation={[degreeNumberToRadian(-90), degreeNumberToRadian(180), degreeNumberToRadian(90)]}
          scale={[10, 28, 10]}
          onCollisionEnter={handleDoorToBossFightonCollisionEnter}
          onCollisionExit={handleDoorToBossFightonCollisionExit}>
          {/* <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <FakeGlowMaterial glowColor="#00fff2" opacity={doorOpacity} />
          </mesh> */}
          <Item
            item={
              {
                name: "MetalDoor",
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
                fileType: "glb",
              }
            }
            isOutlined={true}
            outlineColor={"#ff1e00"}
            outlineThickness={3}
            visible={doorOpacity > 0} 
          />
        </RigidBody>
      )}

    </>
  )
}

export default DoorToBossFight;
