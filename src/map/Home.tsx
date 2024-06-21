import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Home = () => {
  const map = useGLTF("models/map.glb");

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={map.scene} />
    </RigidBody>
  );
};
useGLTF.preload("models/map.glb");
