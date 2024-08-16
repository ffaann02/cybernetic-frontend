import { useGLTF } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import { Mesh } from "three";
import * as THREE from 'three';

interface ItemProps {
    item: {
        name: string;
        position: number[];
        rotation: number;
        rotationX?: number;
        rotationZ?: number;
        scale?: number[];
        idleAnimation?: boolean;
        idleSpeed?: number;
        idleAmplitude?: number;
        idleAxis?: string;
        haslight?: boolean;
        lightIntensity?: number;
        lightRotationY?: number;
    };
    sceneName: string;
    isMovePosY?: boolean;
    arrayOfPosY?: number[];
    IndexOfArray?: number;
}

export const ItemWithUrlIdle: React.FC<ItemProps> = ({ item, sceneName, isMovePosY, arrayOfPosY, IndexOfArray }) => {
    const { name, position, rotation, rotationX, rotationZ, scale, idleAnimation, idleSpeed, idleAmplitude, idleAxis, haslight, lightIntensity, lightRotationY } = item;

    // Define the URL for the GLTF model
    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    const path = `/scene_environments/items/${sceneName}/${name}.glb`;
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

    // Ref to access the mesh
    const ref = useRef<Mesh>(null);
    const lightRef = useRef<any>(null);

    const idlePosX = (clock: THREE.Clock) => {
        if (ref.current && idleAnimation && idleAnimation === true) {
            if (idleSpeed && idleAmplitude) {
                ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                if (haslight && lightRef.current) {
                    lightRef.current.position.x = ref.current.position.x + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                }
            } else {
                ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
            }
        }
    }

    const idlePosY = (clock: THREE.Clock) => {
        if (ref.current && idleAnimation && idleAnimation === true) {
            if (idleSpeed && idleAmplitude) {
                ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                if (haslight && lightRef.current) {
                    lightRef.current.position.y = ref.current.position.y + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                }
            } else {
                ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
            }
        }
    }

    const idlePosXY = (clock: THREE.Clock) => {
        if (ref.current && idleAnimation && idleAnimation === true) {
            if (idleSpeed && idleAmplitude) {
                ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                if (haslight && lightRef.current) {
                    lightRef.current.position.x = ref.current.position.x + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                    lightRef.current.position.y = ref.current.position.y + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                }
            } else {
                ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
                ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
            }
        }
    }

    const idlePosZ = (clock: THREE.Clock) => {
        if (ref.current && idleAnimation && idleAnimation === true) {
            if (idleSpeed && idleAmplitude) {
                ref.current.position.z = position[2] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                if (haslight && lightRef.current) {
                    lightRef.current.position.z = ref.current.position.z + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                }
            } else {
                ref.current.position.z = position[2] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
            }
        }
    }


    useFrame(({ clock }: { clock: THREE.Clock }) => {
        if (idleAxis === 'x') {
            idlePosX(clock);
        }
        else if (idleAxis === 'y') {
            idlePosY(clock);
        }
        else if (idleAxis === 'z') {
            idlePosZ(clock);
        }
        else if (idleAxis === 'xy') {
            idlePosXY(clock);
        }

        if (isMovePosY) {
            if (ref.current && idleAnimation && idleAnimation === true) {
                if (idleSpeed && idleAmplitude) {
                    ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                    if (haslight && lightRef.current) {
                        lightRef.current.position.x = ref.current.position.x + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                    }
                    if (isMovePosY && arrayOfPosY && IndexOfArray) {
                        ref.current.position.y = arrayOfPosY[IndexOfArray] + Math.sin(clock.getElapsedTime() * idleSpeed) * idleAmplitude;
                    }
                } else {
                    ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
                    if (isMovePosY && arrayOfPosY && IndexOfArray) {
                        ref.current.position.y = arrayOfPosY[IndexOfArray] + Math.sin(clock.getElapsedTime() * 1) * 0.1;
                    }
                }
            }
        }
    });

    return (
        <>
            <primitive
                ref={ref}
                object={clone}
                position={position}
                rotation={[((rotationX || 0) * Math.PI) / 2, ((rotation || 0) * Math.PI) / 2, ((rotationZ || 0) * Math.PI) / 2]}
                scale={scale || [1, 1, 1]}
            />
            {haslight &&
                <>
                    <rectAreaLight
                        ref={lightRef}
                        intensity={lightIntensity || 1}
                        width={2.5}
                        height={4}
                        color="#f22602"
                        rotation={[(6 * Math.PI) / 2, lightRotationY || 0, 0]}
                        position={[position[0], position[1] + 1, position[2] - 0.5]} />
                </>
            }
        </>
    );
};
