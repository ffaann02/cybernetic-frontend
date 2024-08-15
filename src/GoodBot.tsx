import React, { useEffect, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export function GoodBot(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/GoodBotNewer.gltf");
  const { actions, names } = useAnimations(animations, group);

  // Clone the entire scene
  const clonedScene = SkeletonUtils.clone(scene);

  useEffect(() => {
    if (group.current) {
      group.current.clear();
      group.current.add(clonedScene);
      console.log(names);
      actions[names[props.animation_index]]?.reset().fadeIn(0.5).play();

      // Apply wireframe settings if wireframe prop is true
      if (props.wireframe) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = true;
            child.material.color = new THREE.Color(props.wireframeColor || "white");
          }
        });
      }
    }
  }, [props.animation_index, props.wireframe, props.wireframeColor]);

  return <group ref={group} {...props} dispose={null} />;
}

useGLTF.preload("/GoodBotNewer.gltf");