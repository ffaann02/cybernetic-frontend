import { CameraControls } from "@react-three/drei";
import Character2D from "../game_object/Character2D";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import * as THREE from "three";

const CharacterController: React.FC = () => {
  const controls = useRef<any>(null);
  const character = useRef<any>(null);
  const rigidBody = useRef<any>(null);
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current.add(event.key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.key);
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
      const cameraDistanceY = window.innerWidth < 1024 ? 10 : 8;
      const cameraDistanceZ = window.innerWidth < 1024 ? 14 : 12;
      const playerWorldPos = vec3(rigidBody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x + 1,
        playerWorldPos.y + cameraDistanceY + 2,
        playerWorldPos.z + cameraDistanceZ,
        playerWorldPos.x + 1,
        playerWorldPos.y + 4,
        playerWorldPos.z,
        true
      );
    }

    if (rigidBody.current) {
      const velocity = new THREE.Vector3();
      if (pressedKeys.current.has("w") || pressedKeys.current.has("ArrowUp")) {
        velocity.z -= 5;
      }
      if (
        pressedKeys.current.has("s") ||
        pressedKeys.current.has("ArrowDown")
      ) {
        velocity.z += 5;
      }
      if (
        pressedKeys.current.has("a") ||
        pressedKeys.current.has("ArrowLeft")
      ) {
        velocity.x -= 5;
      }
      if (
        pressedKeys.current.has("d") ||
        pressedKeys.current.has("ArrowRight")
      ) {
        velocity.x += 5;
      }
      const currentPos = rigidBody.current.translation() as THREE.Vector3;
      const newPos = new THREE.Vector3(
        currentPos.x + velocity.x * delta,
        currentPos.y + velocity.y * delta, // add y velocity to the current position
        currentPos.z + velocity.z * delta
      );
      rigidBody.current.setTranslation(newPos, true);
    }
  });

  return (
    <group>
      <CameraControls ref={controls} />
      <RigidBody
        ref={rigidBody}
        colliders={false}
        linearDamping={10}
        position={[2, -2, 2]}
        lockRotations
      >
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
