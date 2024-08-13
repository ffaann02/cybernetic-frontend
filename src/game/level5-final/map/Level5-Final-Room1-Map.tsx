import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { Color, MeshStandardMaterial } from "three";
import { Box } from "@react-three/drei"; // Import Box from drei

export const Level5FinalRoom1Map = () => {
  const map = useGLTF("models/map-test.glb");

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
    <>
      <fog attach="fog" args={["#d30303", 0, 240]} />
      <RigidBody
        colliders="trimesh"
        type="fixed"
        name="floor"
        position={[35, 0.1, 0]}
        scale={[8, 5, 8]}
      >
        <primitive object={clone} />
        {/* Add a red box inside the RigidBody */}
        <Box args={[12, 6, 0.5]} position={[-8, 3, 4.9]}>
          <meshStandardMaterial attach="material" color="red" transparent opacity={0} />
        </Box>
      </RigidBody>
    </>
  );
};

useGLTF.preload("models/map-test.glb");