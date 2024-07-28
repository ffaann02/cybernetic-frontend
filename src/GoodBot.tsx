import React, { useEffect, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function GoodBot(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/GoodBotNew.gltf");
  const { actions, names } = useAnimations(animations, group);

  // Clone the entire scene
  const clonedScene = SkeletonUtils.clone(scene);

  useEffect(() => {
    if (group.current) {
      group.current.clear();
      group.current.add(clonedScene);
      console.log(names);
      actions[names[props.animation_index]]?.reset().fadeIn(0.5).play();
    }
  }, []);

  return <group ref={group} {...props} dispose={null} />;
}

useGLTF.preload("/GoodBotNew.gltf");
