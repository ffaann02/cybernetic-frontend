import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

export const Tutorial = () => {
  const map = useGLTF("models/tutorial-map-test.glb");

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
      position={[16, 0.1, 0]}
      scale={[2, 2, 2]}
    >
      <primitive object={clone} />
    </RigidBody>
  );
};

useGLTF.preload("models/tutorial-map-test.glb");
