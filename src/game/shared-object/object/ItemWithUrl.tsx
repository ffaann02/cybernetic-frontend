import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

interface ItemProps {
    item: {
        name: string;
        fileType: string;
        position: number[];
        rotation: number;
        rotationX?: number;
        rotationZ?: number;
        scale?: number[];
    };
    sceneName: string;
}

export const ItemWithUrl: React.FC<ItemProps> = ({ item, sceneName }) => {
    const { name, fileType, position, rotation, rotationX, rotationZ, scale } = item;

    // Define the URL for the GLTF model
    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    const path = `/scene_environments/items/${sceneName}/${name}.${fileType}`;
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
            rotation={[((rotationX || 0)  * Math.PI) / 2, ((rotation || 0) * Math.PI) / 2, ((rotationZ || 0) * Math.PI) / 2]}
            scale={scale || [1, 1, 1]}
        />
    );
};
