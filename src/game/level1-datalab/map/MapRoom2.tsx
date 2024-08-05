import { Box, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { Color } from "three";
import { degreeNumberToRadian } from "../../../utils";

export const MapRoom2 = () => {
  const map = useGLTF("models/map-test.glb");

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
        position={[16, 0.1, 0]}
        scale={[5, 4, 5]}
        // ref={enterDoorRef}a
      >
        <primitive object={clone} />
        <Box args={[12, 6, 0.1]} position={[-8, 3, 4.9]}>
          <meshStandardMaterial
            attach="material"
            color="red"
            transparent
            opacity={0}
          />
        </Box>
      </RigidBody>
    </>
  );
};

useGLTF.preload("models/map-test.glb");
