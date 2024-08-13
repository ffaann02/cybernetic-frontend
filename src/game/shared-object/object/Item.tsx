import { useGLTF, useFBX, useTexture, Outlines, Sphere } from "@react-three/drei";
import { useContext, useMemo } from "react";
import { OBJLoader, SkeletonUtils } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GameContext } from "../../../contexts/GameContext";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";

interface ItemProps {
  item: {
    name: string;
    position: number[];
    rotation?: number[];
    scale?: number[];
    fileType: string;
    textures?: string[]; // Array of texture paths
    color?: string; // Add color prop
  };
  type?: string;
  meshRef?: any;
  opacity?: number;
  isOutlined?: boolean;
  status?: string;
  outlineColor?: string;
  outlineThickness?: number;
  ref?: any;
  visible?: boolean;
}

export const Item: React.FC<ItemProps> = ({
  item,
  type,
  meshRef,
  opacity,
  isOutlined,
  status,
  outlineColor,
  outlineThickness = 0.1,
  ref,
  visible = true
}) => {
  const { name, position, rotation, scale, fileType, textures, color } = item;
  const { currentHit } = useContext(GameContext);

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
        if (color) {
          const material = new THREE.MeshStandardMaterial({
            color: color, // Default to white if no color is provided
            opacity: opacity !== undefined ? opacity : 1, // Default to fully opaque if no opacity is provided
            transparent: true,
            toneMapped: false // Add toneMapped property
          });
          (child as any).material = material;
        }
        meshes.push(child);
      }
    });

    return meshes;
  }, [scene, opacity, color]);

  return (
    <>
      {visible &&
        <>
          {
            meshes.map((mesh: any, index: number) => (
              <mesh
                ref={ref}
                key={index}
                geometry={(mesh as any).geometry}
                material={(mesh as any).material}
                position={position}
                scale={scale || [1, 1, 1]}
                rotation={rotation || [0, 0, 0]}
                castShadow
                toneMapped={false} // Add toneMapped property
              >
                {isOutlined && (
                  <Outlines
                    thickness={outlineThickness || 1}
                    color={outlineColor || "white"}
                    angle={180}
                    screenspace={true}
                  />
                )}
              </mesh>
            ))
          }
        </>
      }
    </>
  );
};