import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { degreeNumberToRadian } from "../utils";
import { Color } from "three";

export const Level1DataLabRoom2 = ({ enterDoorRef }) => {
  const map = useGLTF("models/level1-map.glb");

  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(map.scene);
    clonedScene.traverse((object) => {
      if ((object as any).isMesh) {
        object.receiveShadow = true;
        object.material.color = new Color("white");
      }
    });
    return clonedScene;
  }, [map.scene]);

  return (
    <>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        name="floor"
        position={[160, 0.1, -70]}
        scale={[3, 3, 3]}
        // ref={enterDoorRef}
      >
        <primitive object={clone} />
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        name="head-glass-bridge-data-lab-01"
        position={[135.5, 0.1, -16]}
        scale={[3, 3, 3]}
        ref={enterDoorRef}
      >
        <mesh
          castShadow
          position={[0, 0, 0]}
        >
          <boxGeometry args={[4, 0.1, 4]} />
          <meshStandardMaterial
            color={"purple"}
            opacity={0.5}
            transparent={true}
          />
        </mesh>
      </RigidBody>
    </>
  );
};

useGLTF.preload("models/level1-map.glb");
