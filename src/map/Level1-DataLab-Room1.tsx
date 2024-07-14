import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { degreeNumberToRadian } from "../utils";
import { Color } from "three";

export const Level1DataLabRoom1 = () => {
  const map = useGLTF("models/level1-map.glb");

  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(map.scene);
    clonedScene.traverse((object) => {
      if ((object as any).isMesh) {
        object.receiveShadow = true;
        object.material.color = new Color('white');
    }
    });
    return clonedScene;
  }, [map.scene]);

  return (
    <RigidBody
      colliders="trimesh"
      type="fixed"
      name="floor"
      position={[16, 0.1, 0]}
      scale={[3, 3, 3]}
    >
      <primitive object={clone} />
    </RigidBody>
  );
};

useGLTF.preload("models/level1-map.glb");
