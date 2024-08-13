import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise";
import { easing } from "maath";
import * as React from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
  }`;

const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uThickness;
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uNoiseScale;
  
  void main() {
    gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
    float noise = gln_sfbm(vPosition * uNoiseScale, opts); // Scale the noise
    noise = gln_normalize(noise);

    float progress = uProgress;

    float alpha = step(1.0 - progress, noise);
    float border = step((1.0 - progress) - uThickness, noise) - alpha;
    
    csm_DiffuseColor.a = alpha + border;
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
  }`);

export function DissolveMaterial({
  baseMaterial,
  thickness = 0.1,
  color = "#eb5a13",
  intensity = 50,
  duration = 1.2,
  noiseScale = 1.0, // Add the noiseScale prop
  visible = true,
  onFadeOut,
}) {
  const uniforms = React.useRef({
    uThickness: { value: thickness },
    uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
    uProgress: { value: 0 },
    uNoiseScale: { value: noiseScale }, // Add noiseScale to uniforms
  });

  React.useEffect(() => {
    uniforms.current.uThickness.value = thickness;
    uniforms.current.uColor.value.set(color).multiplyScalar(intensity);
    uniforms.current.uNoiseScale.value = noiseScale; // Update the noiseScale uniform
  }, [thickness, color, intensity, noiseScale]);

  useFrame((_state, delta) => {
    easing.damp(
      uniforms.current.uProgress,
      "value",
      visible ? 1 : 0,
      duration,
      delta
    );

    if (uniforms.current.uProgress.value < 0.1 && onFadeOut) {
      onFadeOut();
    }

    if (uniforms.current.uProgress.value > 1) {
      console.log("Fade out");
    }
  });

  return (
    <>
      <CSM
        baseMaterial={baseMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        toneMapped={false}
        transparent
      />
    </>
  );
}
