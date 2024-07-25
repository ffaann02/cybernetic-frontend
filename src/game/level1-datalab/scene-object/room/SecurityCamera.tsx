// import { PerspectiveCamera } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
// import { degreeNumberToRadian } from "../../../../utils";
// import { euler, quat, vec3 } from "@react-three/rapier";
// import * as THREE from "three";

// export const SecurityCamera = ({ cameraRef, laserRef }) => {
//   const [keys, setKeys] = useState({
//     w: false,
//     a: false,
//     s: false,
//     d: false,
//     ArrowUp: false,
//     ArrowDown: false,
//   });


//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       setKeys((prevKeys) => ({ ...prevKeys, [event.key]: true }));
//     };
//     const handleKeyUp = (event) => {
//       setKeys((prevKeys) => ({ ...prevKeys, [event.key]: false }));
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   useFrame(() => {
//     if (cameraRef.current && laserRef.current) {
//       const { position, rotation } = cameraRef.current;
//       let moveSpeed = 0.1;
//       let rotationSpeed = 0.02;

//       // If rotation.y is out of the desired range, return early
//       const rotationYInDegrees = rotation.y * (180 / Math.PI);

//       // If rotationYInDegrees is out of the desired range, return early
//       if (rotationYInDegrees > 180 || rotationYInDegrees < -180) {
//         console.log("out");
//       }

//       const laserPosition = vec3(laserRef.current.translation());
//       // Movement speed and rotation speed

//       // Update horizontal rotation (left/right) with clamping
//       if (keys.a) {
//         rotation.y += rotationSpeed;
//         // laserRef.current.addTorque({ x: 0, y: 0, z: 10 }, true);
//       }
//       if (keys.d) {
//         rotation.y -= rotationSpeed;
//         // laserRef.current.addTorque({ x: 0, y: 0, z: 10 }, true);
//       }


//       // Update vertical position (up/down) instead of rotation
//       if (keys.w || keys.ArrowUp) {
//         position.y += moveSpeed; // Move up
//         const newPos = new THREE.Vector3(
//           laserPosition.x,
//           laserPosition.y + moveSpeed,
//           laserPosition.z,
//         )
//         laserRef.current.setTranslation(newPos, true);
//       }
//       if (keys.s || keys.ArrowDown) {
//         position.y -= moveSpeed; // Move down
//         const newPos = new THREE.Vector3(
//           laserPosition.x,
//           laserPosition.y - moveSpeed,
//           laserPosition.z,
//         )
//         laserRef.current.setTranslation(newPos, true);
//       }

//       // Clamping x rotation to avoid flipping over
//       rotation.x = Math.max(Math.min(rotation.x, Math.PI / 2), -Math.PI / 2);

//       // Ensure y rotation wraps around, creating a continuous rotation effect
//       if (rotation.y > Math.PI) rotation.y -= 2 * Math.PI;
//       else if (rotation.y < -Math.PI) rotation.y += 2 * Math.PI;
//     }
//   });

//   return (
//       <PerspectiveCamera
//         makeDefault
//         ref={cameraRef}
//         position={[-3, 22, -21]}
//         rotation={[
//           degreeNumberToRadian(0),
//           degreeNumberToRadian(140),
//           degreeNumberToRadian(0),
//         ]}
//       />
//   );
// };


import { Outlines, PerspectiveCamera } from "@react-three/drei";
import { CuboidCollider, CylinderCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { degreeNumberToRadian } from "../../../../utils";
import * as THREE from "three";

export const SecurityCamera = ({ cameraRef }) => {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  const colliderRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys((prevKeys) => ({ ...prevKeys, [event.key]: true }));
    };
    const handleKeyUp = (event) => {
      setKeys((prevKeys) => ({ ...prevKeys, [event.key]: false }));
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (cameraRef.current && colliderRef.current) {
      const { position, rotation } = cameraRef.current;
      let moveSpeed = 0.1;
      let rotationSpeed = 0.02;

      const rotationYInDegrees = rotation.y * (180 / Math.PI);

      if (rotationYInDegrees > 180 || rotationYInDegrees < -180) {
        console.log("out");
      }

      // Update horizontal rotation (left/right) with clamping
      if (keys.a) rotation.y += rotationSpeed;
      if (keys.d) rotation.y -= rotationSpeed;

      // Update vertical position (up/down) instead of rotation
      if (keys.w || keys.ArrowUp) position.y += moveSpeed; // Move up
      if (keys.s || keys.ArrowDown) position.y -= moveSpeed; // Move down

      // Clamping x rotation to avoid flipping over
      rotation.x = Math.max(Math.min(rotation.x, Math.PI / 2), -Math.PI / 2);

      // Ensure y rotation wraps around, creating a continuous rotation effect
      if (rotation.y > Math.PI) rotation.y -= 2 * Math.PI;
      else if (rotation.y < -Math.PI) rotation.y += 2 * Math.PI;

      // Update the collider's position and rotation
      // colliderRef.current.setTranslation(new THREE.Vector3(position.x, position.y, position.z), true);

      // Calculate the new position for the collider
      const laserOffset = new THREE.Vector3(0, 0, -52);
      laserOffset.applyQuaternion(cameraRef.current.quaternion);
      const colliderPosition = new THREE.Vector3().copy(cameraRef.current.position).add(laserOffset);

      // Update the collider's position and rotation
      colliderRef.current.setTranslation(colliderPosition, true);
      colliderRef.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(degreeNumberToRadian(0), rotation.y, degreeNumberToRadian(90))), true);
    }
  });

  return (
    <>
      <group ref={cameraRef} position={[-3, 22, -21]} rotation={[degreeNumberToRadian(0), degreeNumberToRadian(140), degreeNumberToRadian(0)]}>
        <CuboidCollider 
          name="CameraLaser" 
          ref={colliderRef} 
          args={[0.5, 0.5, 50]} 
          rotation={[degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)]} />
        <mesh position={[0, 0, -52]} rotation={[degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(0)]}>
          <cylinderGeometry args={[0.05, 0.05, 100, 32]} />
          <meshBasicMaterial color="#4ff08d" />
           <Outlines thickness={5} color="white" angle={180} screenspace={true} />
        </mesh>
        <PerspectiveCamera makeDefault/>
      </group>
    </>
  );
};