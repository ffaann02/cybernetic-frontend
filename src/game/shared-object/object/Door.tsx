import { RigidBody, vec3 } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../utils";
import { Item } from "./Item";
import { useContext, useRef, useEffect } from "react";
import { GameContext } from "../../../contexts/GameContext";
import * as THREE from "three";
import { Outlines } from "@react-three/drei";

const Door = ({
  doorname,
  destinationObject,  // Updated prop name
  rigidBody,
  position,
  rotation,
  status
}) => {
  const { currentHit, setCurrentHit } = useContext(GameContext);
  const doorBorderRef = useRef<any>();

  useEffect(() => {
    if (!rigidBody) {
      console.error("rigidBody ref is not provided or initialized");
    }
  }, [rigidBody]);

  const movePlayerToDestination = () => {
    console.log("hit the door");
    const destinationPosition = vec3(destinationObject.current.translation())
    console.log(destinationPosition);
    if (destinationObject.current && rigidBody.current) {
      const destinationPosition = vec3(destinationObject.current.translation())
      console.log(destinationPosition);
      rigidBody.current.setTranslation(destinationPosition, true);
    } else {
      console.error("Destination object or rigidBody ref not found");
    }
  };

  return (
    <RigidBody
      colliders="trimesh"
      mass={0}
      type="fixed"
      name={doorname}
      position={position}
      rotation={rotation}
      scale={[2, 3, 3]}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player" && status === "close") {
          setCurrentHit("door");
        }
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player" && status === "open") {
          setCurrentHit("door");
          movePlayerToDestination();
        }
      }}
      onCollisionExit={({ other }) => {
        setCurrentHit("");
      }}
    >
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.3, 2, 0.9]} />
        <meshStandardMaterial
          color={status === "close" ? "red" : "green"}
          transparent={true}
          opacity={0.5}
          ref={doorBorderRef}
        />
      </mesh>
      <Item
        item={{
          name: "door-border",
          position: [0, 0, 0],
          rotation: 0,
          fileType: "glb",
        }}
        isOutlined={true}
        status={status}
      />
    </RigidBody>
  );
};
export default Door;
