import React from 'react';
import { Outlines, useGLTF } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from 'three';

interface ItemProps {
  item: {
    name: string;
    fileType: string;
    position: number[];
    rotation: number;
    scale?: number[];
    spinSpeed: number;
    spinAxis: string;
  };
  sceneName: string;
}

const ItemWithUrlSpin: React.FC<ItemProps> = ({
  item,
  sceneName,
}) => {

  const { name, fileType, position, rotation, scale, spinSpeed, spinAxis } = item;

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

  const ref = useRef<THREE.Mesh>(null);

  const spinWithUnlimitAmplitude = (clock: THREE.Clock) => {
    if (ref.current && spinAxis === 'y' && spinSpeed) {
      ref.current.rotation.y = clock.getElapsedTime() * spinSpeed;
    }
    else if (ref.current && spinAxis === 'xy' && spinSpeed) {
      ref.current.rotation.x = clock.getElapsedTime() * spinSpeed;
      ref.current.rotation.y = clock.getElapsedTime() * spinSpeed;
    }
  }


  useFrame(({ clock }) => {
    spinWithUnlimitAmplitude(clock);
  });

  return (
      <primitive
        ref={ref}
        object={clone}
        position={position}
        rotation={[0, ((rotation || 0) * Math.PI) / 2, 0]}
        scale={scale || [1, 1, 1]}
      />
  );
}

export default ItemWithUrlSpin;
