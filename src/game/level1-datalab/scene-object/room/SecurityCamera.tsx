import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { degreeNumberToRadian } from "../../../../utils";

export const SecurityCamera = ({ cameraRef }) => {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
  });

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
    if (cameraRef.current) {
      const { position, rotation } = cameraRef.current;
      let moveSpeed = 0.1;
      let rotationSpeed = 0.02;
      // If rotation.y is out of the desired range, return early
      const rotationYInDegrees = rotation.y * (180 / Math.PI);

      // If rotationYInDegrees is out of the desired range, return early
      if (rotationYInDegrees > 180 || rotationYInDegrees < -180) {
        console.log("out");
      }
      //   console.log(rotation);

      // Movement speed and rotation speed

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
    }
  });

  return (
    <PerspectiveCamera
      makeDefault
      ref={cameraRef}
      position={[-3, 22, -21]}
      rotation={[
        degreeNumberToRadian(0),
        degreeNumberToRadian(140),
        degreeNumberToRadian(0),
      ]}
    />
  );
};
