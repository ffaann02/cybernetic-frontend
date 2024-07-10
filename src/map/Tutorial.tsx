import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

export const Tutorial = () => {
  const map = useGLTF("models/map.glb");

  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(map.scene);
    clonedScene.traverse((object) => {
      if ((object as any).isMesh) {
        object.receiveShadow = true;
      }
    });
    return clonedScene;
  }, [map.scene]);

  return (
    <RigidBody
      colliders="trimesh"
      type="fixed"
      name="floor"
      position={[0, 0.1, 0]}
    >
      <primitive object={clone} />
    </RigidBody>
  );
};

useGLTF.preload("models/map.glb");
