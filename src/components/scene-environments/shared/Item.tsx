import { useGLTF, useFBX, useTexture } from "@react-three/drei";
import { useContext, useMemo } from "react";
import { OBJLoader, SkeletonUtils } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GameContext } from "../../../contexts/GameContext";

interface ItemProps {
  item: {
    name: string;
    position: number[];
    rotation: number;
    scale?: number[];
    fileType: string;
    textures?: string[]; // Array of texture paths
  };
  type?: string;
}

export const Item: React.FC<ItemProps> = ({ item,type }) => {
  const { name, position, rotation, scale, fileType, textures } = item;
  const {currentHit} = useContext(GameContext);

  // Load the model based on fileType
  let scene;
  if (fileType === "gltf" || fileType === "glb") {
    ({ scene } = useGLTF(`/models/map_object/${name}.${fileType}`));
  } else if (fileType === "fbx") {
    scene = useFBX(`/models/map_object/${name}.${fileType}`);
  } else if (fileType === "obj") {
    scene = useLoader(OBJLoader, `/models/map_object/${name}.${fileType}`);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Extract geometries and materials
  const meshes = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(scene);
    const meshes: any = [];

    clonedScene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        meshes.push(child);
      }
    });

    return meshes;
  }, [scene]);

  return (
    <>
      {meshes.map((mesh: any, index: number) => (
        <mesh
          key={index}
          geometry={(mesh as any).geometry}
          material={(mesh as any).material}
          position={position}
          // rotation={[0, ((rotation || 0) * Math.PI) / 2, 0]}
          scale={scale || [1, 1, 1]}
          castShadow
        >
          {/* {currentHit==='computer' ? <meshPhongMaterial color={0xff00ff} />:null} */}
        </mesh>
      ))}
    </>
  );
};
