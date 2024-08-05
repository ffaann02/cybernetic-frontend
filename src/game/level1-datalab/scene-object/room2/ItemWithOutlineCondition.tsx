import { useGLTF, useFBX, useTexture, Outlines } from "@react-three/drei";
import { useContext, useMemo, useRef } from "react";
import { OBJLoader, SkeletonUtils } from "three-stdlib";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import FakeGlowMaterial from "../../../components/FakeGlowMaterial";
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
    isOutlined?: boolean;
    normalThickness?: number;
    focusedThickness?: number;
    isSpin?: boolean;
    spinSpeed?: number;
    spinAxis?: string;

}

export const ItemWithOutlineCondition: React.FC<ItemProps> = ({
    item,
    type,
    meshRef,
    opacity,
    isOutlined,
    normalThickness,
    focusedThickness,
    isSpin,
    spinSpeed,
    spinAxis
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
        if (ref.current && spinAxis === 'x' && spinSpeed) {
            ref.current.rotation.x = clock.getElapsedTime() * spinSpeed;
        }
        if (ref.current && spinAxis === 'y' && spinSpeed) {
            ref.current.rotation.y = clock.getElapsedTime() * spinSpeed;
        }
        if (ref.current && spinAxis === 'z' && spinSpeed) {
            ref.current.rotation.z = clock.getElapsedTime() * spinSpeed;
        }
    }
    useFrame(({ clock }) => {
        if(isSpin){
            spinWithUnlimitAmplitude(clock);
        }
        else{
            return;
        }
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

                    {isOutlined ? (
                        <Outlines
                            thickness={focusedThickness ? focusedThickness : 6.5}
                            color={"#4ff08d"}
                            angle={180}
                            screenspace={true}
                        />
                    ) : <Outlines
                        thickness={normalThickness ? normalThickness : 2.5}
                        color={"white"}
                        angle={180}
                        screenspace={true}
                    />}
                </mesh>
            ))}
        </>
    );
};
