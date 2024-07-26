import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const vertexShader = `
precision highp float;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;

in vec2 vUv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = vUv * u_resolution / min(u_resolution.x, u_resolution.y);

    vec3 color = vec3(st.x, st.y, abs(sin(u_time)));

    out_color = vec4(color, 1.0);
}`;

const FlameBox = () => {
  const meshRef = useRef();
  const materialRef = useRef(new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_time: { value: 0 },
    },
  }));

  useFrame((state, delta) => {
    materialRef.current.uniforms.u_time.value += delta;
  });

  return (
    <mesh ref={meshRef} material={materialRef.current}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

export default FlameBox;
