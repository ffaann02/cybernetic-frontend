import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

interface ItemProps {
  item: {
    name: string;
    position: number[];
    rotation: number;
    scale?: number[];
  };
}

export const Item: React.FC<ItemProps> = ({ item }) => {
  const { name, position, rotation,scale } = item;
  const { scene } = useGLTF(`/models/map_object/${name}.gltf`);
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={[0, ((rotation || 0) * Math.PI) / 2, 0]}
      scale={scale || [1, 1, 1]}
    />
  );
};
