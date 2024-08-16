import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import {
  EffectComposer,
  ShaderPass,
  RenderPass,
  FXAAShader,
  OutlinePass,
} from "three-stdlib";

export const Outline = ({ children }) => {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef(null);
  const [hovered, set] = useState([]);
  const aspect = useMemo(() => new Vector2(size.width, size.height), [size]);

  useEffect(() => {
    // Ensure the ref.current is null to avoid creating multiple instances
    if (composer.current === null) {
      composer.current = new EffectComposer(gl);
      composer.current.addPass(new RenderPass(scene, camera));
      const outlinePass = new OutlinePass(aspect, scene, camera);
      outlinePass.selectedObjects = hovered;
      outlinePass.visibleEdgeColor.set('white');
      outlinePass.edgeStrength = 1;
      outlinePass.edgeThickness = 1;
      composer.current.addPass(outlinePass);
      const shaderPass = new ShaderPass(FXAAShader);
      shaderPass.uniforms['resolution'].value = [1 / size.width, 1 / size.height];
      composer.current.addPass(shaderPass);
    }

    return () => {
      // Cleanup
      if (composer.current) {
        composer.current.dispose();
      }
    };
  }, [gl, scene, camera, size, hovered, aspect]);

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame(() => composer.current?.render(), 1);

  return <>{children}</>;
};