import { useGLTF, useFBX, useTexture, Outlines } from "@react-three/drei";
import { useContext, useMemo, useRef } from "react";
import { OBJLoader, SkeletonUtils } from "three-stdlib";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GameContext } from "../../../../contexts/GameContext";

interface ItemProps {
    item: {
        name: string;
        position: number[];
        rotation: number;
        scale?: number[];
        fileType: string;
        textures?: string[]; // Array of texture paths
        color?: string; // Add color prop
    };
    type?: string;
    meshRef?: any;
    opacity?: number;

}

export const ItemDropped: React.FC<ItemProps> = ({
    item,
    type,
    meshRef,
    opacity,
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
                        transparent: opacity !== undefined && opacity < 1, // Set transparent if opacity is less than 1
                    });
                    (child as any).material = material;
                }
                meshes.push(child);
            }
        });

        return meshes;
    }, [scene, opacity, color]);

    const ref = useRef<THREE.Mesh>(null);
    const spinWithUnlimitAmplitude = (clock: THREE.Clock) => {
        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 1;
        }
    }
    useFrame(({ clock }) => {
        spinWithUnlimitAmplitude(clock);
    });

    return (
        <>
            {meshes.map((mesh: any, index: number) => (
                <mesh
                    ref={ref}
                    key={index}
                    geometry={(mesh as any).geometry}
                    material={(mesh as any).material}
                    position={position}
                    scale={scale || [1, 1, 1]}
                    castShadow
                >

                    <Outlines
                        thickness={1}
                        color={"white"}
                        angle={180}
                        screenspace={true}
                    />
                </mesh>
            ))}
        </>
    );
};
