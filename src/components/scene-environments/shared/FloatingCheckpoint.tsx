import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { degreeNumberToRadian } from "../../../utils";
import { Item } from "./Item";

const FloatingCheckpoint = ({ item, index, setHitCheckpoints }) => {
  const rigidBodyRef = useRef();
  const meshRef = useRef();
  const [isHit, setIsHit] = useState(false); // State to track if checkpoint has been hit

  useFrame((state) => {
    if (rigidBodyRef.current) {
      const t = state.clock.getElapsedTime();
      const yOffset = Math.sin(t * 3) * 0.5; // Floating effect

      // Update the RigidBody's translation
      rigidBodyRef.current.setTranslation({
        x: item.position[0],
        y: item.position[1] + yOffset,
        z: item.position[2],
      });
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      name={"checkpoint_" + index}
      type="fixed"
      scale={[0.5, 0.5, 0.5]}
      position={item.position}
      rotation={[
        degreeNumberToRadian(90),
        degreeNumberToRadian(45),
        degreeNumberToRadian(0),
      ]}
      onCollisionEnter={({ other }) => {
        if (!isHit && other.rigidBodyObject && other.rigidBodyObject.name === "player") {
          console.log("player hit this checkpoint");
          setHitCheckpoints(prev => prev + 1);
          setIsHit(true); // Mark as hit to prevent further actions
          if (meshRef.current) {
            meshRef.current.visible = false; // Hide the checkpoint
          }
        }
      }}
    >
      <Item item={item} type="check_point" meshRef={meshRef}/>
    </RigidBody>
  );
};

export default FloatingCheckpoint;