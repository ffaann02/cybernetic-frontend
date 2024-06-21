import { CameraControls } from "@react-three/drei";
import Character2D from "../game_object/Character2D";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const CharacterController = () => {
  const controls = useRef();
  const character = useRef();
  const rigidBody = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          velocity.current.z = -5;
          break;
        case "s":
        case "ArrowDown":
          velocity.current.z = 5;
          break;
        case "a":
        case "ArrowLeft":
          velocity.current.x = -5;
          break;
        case "d":
        case "ArrowRight":
          velocity.current.x = 5;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case "w":
        case "ArrowUp":
        case "s":
        case "ArrowDown":
          velocity.current.z = 0;
          break;
        case "a":
        case "ArrowLeft":
        case "d":
        case "ArrowRight":
          velocity.current.x = 0;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
    }

    if (rigidBody.current) {
      const currentPos = rigidBody.current.translation();
      const newPos = new THREE.Vector3(
        currentPos.x + velocity.current.x * delta,
        currentPos.y,
        currentPos.z + velocity.current.z * delta
      );
      rigidBody.current.setTranslation(newPos, true);
    }
  });

  return (
    <group>
      {/* <CameraControls ref={controls} /> */}
      <RigidBody ref={rigidBody} colliders={false} linearDamping={10} position={[2, -2, 2]} lockRotations>
        <group ref={character}>
          <Character2D />
          <CapsuleCollider
            args={[
              1, // radius
              1, // height
            ]}
            position={[1, 4, 4]}
          />
        </group>
      </RigidBody>
    </group>
  );
};

export default CharacterController;
