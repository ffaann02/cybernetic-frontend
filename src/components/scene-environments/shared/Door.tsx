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
  rigidBody
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
      position={[-8, 0, -15]}
      scale={[2, 3, 3]}
      rotation={[
        degreeNumberToRadian(0),
        degreeNumberToRadian(90),
        degreeNumberToRadian(0),
      ]}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
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
          color="red"
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
      />
    </RigidBody>
  );
};
export default Door;
