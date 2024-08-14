import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLevel6Context } from "../../../../contexts/SceneContext/Level6Context";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import FakeGlowMaterial from "../../../../components/FakeGlowMaterial";
import { PerspectiveCamera, Sphere } from "@react-three/drei";
import { degreeNumberToRadian } from "../../../../utils";
import { GameContext } from "../../../../contexts/GameContext";
import { useSpring, a } from "@react-spring/three"; // Import animated
import { GoodBot } from "../../../../GoodBot";
import SmoothCamera from "../../../../controllers/SmoothCamera";

const MazeSolver = ({
  mazeSolverStartPosition,
  mazeSolverMovingSpeed,
  mazePosition,
  openPathWidth,
}) => {
  const { isUsingSecurityCamera } = useContext(GameContext);
  const { mazeStateDetail } = useLevel6Context();

  const ref = useRef<any>(null);
  const arrowRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Using react-spring for smooth transitions
  const [springProps, api] = useSpring(() => ({
    position: mazeSolverStartPosition,
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 },
  }));

  // Calculate the target position based on the current state and maze position
  const targetPosition = useMemo(() => {
    if (!mazeStateDetail || !mazeStateDetail.state) {
      return mazeSolverStartPosition;
    }

    const x = mazeStateDetail.state[0];
    const z = mazeStateDetail.state[1];

    // Add mazePosition offset to the calculated position
    return [
      mazePosition[0] + x * openPathWidth,
      mazePosition[1] + 1, // Adjust y for the box height
      mazePosition[2] + z * openPathWidth,
    ];
  }, [mazeStateDetail, openPathWidth, mazePosition]);

  useEffect(() => {
    let newPosition = [
      targetPosition[0] + mazePosition[0] * -1,
      targetPosition[1] + 12,
      targetPosition[2] + mazePosition[2] * -1,
    ];

    let newRotation;
    // -1: Initial, 0: Forward, 1: Right, 2: Backward, 3: Left
    if (mazeStateDetail && mazeStateDetail.action) {
      if (mazeStateDetail.action === -1 || mazeStateDetail.action === 0) {
        newRotation = [0, degreeNumberToRadian(0), 0];
        newPosition[2] = newPosition[2] + 5;
        // console.log('Forward');
      } else if (mazeStateDetail.action === 1) {
        newRotation = [0, degreeNumberToRadian(-90), 0];
        newPosition[0] = newPosition[0] - 5;
        // console.log('Right');
      } else if (mazeStateDetail.action === 2) {
        newRotation = [0, degreeNumberToRadian(180), 0];
        newPosition[2] = newPosition[2] - 5;
        // console.log('Backward');
      } else if (mazeStateDetail.action === 3) {
        newRotation = [0, degreeNumberToRadian(90), 0];
        newPosition[0] = newPosition[0] + 5;
        // console.log('Left');
      }
    }

    api.start({ position: newPosition, rotation: newRotation });
  }, [targetPosition, api, mazeStateDetail, mazePosition]);

  const updateArrowPosition = () => {
    if (!arrowRef.current) return;

    const targetPosition = ref.current.translation();
    const currentPosition = arrowRef.current.translation();

    // Calculate the direction and velocity
    const velocityX = targetPosition.x - currentPosition.x;
    const velocityZ = targetPosition.z - currentPosition.z;

    arrowRef.current.setLinvel(
      {
        x: velocityX * mazeSolverMovingSpeed,
        y: 0,
        z: velocityZ * mazeSolverMovingSpeed,
      },
      true
    );
  };

  useFrame(() => {
    if (!ref.current || !cameraRef.current) return;

    const currentPosition = ref.current.translation();
    const [targetX, targetY, targetZ] = targetPosition;

    // Calculate the direction and velocity
    const velocityX = targetX - currentPosition.x;
    const velocityY = targetY - currentPosition.y;
    const velocityZ = targetZ - currentPosition.z;

    ref.current.setLinvel(
      {
        x: velocityX * mazeSolverMovingSpeed,
        y: velocityY * mazeSolverMovingSpeed,
        z: velocityZ * mazeSolverMovingSpeed,
      },
      true
    );

    updateArrowPosition();
  });

  return (
    <>
      {isUsingSecurityCamera && mazeStateDetail.done === true && (
        <SmoothCamera
          targetPosition={[20, 65, 20]}
          rotation={[
            degreeNumberToRadian(-90),
            degreeNumberToRadian(0),
            degreeNumberToRadian(0),
          ]}
        />
      )}
      {isUsingSecurityCamera && mazeStateDetail.done !== true && (
        <>
          <a.group
            ref={cameraRef}
            position={springProps.position}
            rotation={springProps.rotation}
          >
            {isUsingSecurityCamera && mazeStateDetail.done === false && (
              <PerspectiveCamera
                position={[0, 0, 0]}
                makeDefault
                rotation={[degreeNumberToRadian(-35), 0, 0]}
              />
            )}
          </a.group>
          <RigidBody
            ref={ref}
            lockTranslations
            lockRotations
            colliders={false}
            type="dynamic"
            scale={[1.5, 1.5, 1.5]}
            position={[0, 0, 0]} // Initial position
          >
            <a.group rotation={springProps.rotation}>
              <group rotation={[0, degreeNumberToRadian(90), 0]}>
                <GoodBot animation_index={2} />
              </group>
            </a.group>
          </RigidBody>
        </>
      )}
    </>
  );
};

export default MazeSolver;
