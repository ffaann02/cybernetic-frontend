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

export const ItemWithUrl: React.FC<ItemProps> = ({ item }) => {
    const { name, position, rotation, scale } = item;

    // Define the URL for the GLTF model
    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    const path = `/scene_environments/items/scene_name/${name}.gltf`;
    const url = `${storageBucket}${path}`;
    
    // Load the model from the URL
    const { scene } = useGLTF(url);

    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => {
        const clonedScene = SkeletonUtils.clone(scene);
        clonedScene.traverse((object) => {
            if ((object as any).isMesh) {
                object.castShadow = true;
            }
        });
        return clonedScene;
    }, [scene]);

    return (
        <primitive
            object={clone}
            position={position}
            rotation={[0, ((rotation || 0) * Math.PI) / 2, 0]}
            scale={scale || [1, 1, 1]}
        />
    );
};
