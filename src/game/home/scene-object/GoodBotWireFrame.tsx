import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function GoodBotWireFrame(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/GoodBotNew.gltf");
  const { actions, names } = useAnimations(animations, group);

  // Clone the entire scene
  const clonedScene = SkeletonUtils.clone(scene);

  // Set wireframe property to true for each material
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = true;
      child.material.wireframeLinewidth = 1; // Adjust the line width if needed
      child.material.color.set('cyan'); // Set the desired wireframe color
    }
  });

  useEffect(() => {
    if (group.current) {
      group.current.clear();
      group.current.add(clonedScene);
      console.log(names);
      actions[names[props.animation_index]]?.reset().fadeIn(0.5).play();
    }
  }, [clonedScene, actions, names, props.animation_index]);

  return <group ref={group} {...props} dispose={null} />;
}

useGLTF.preload("/GoodBotNew.gltf");