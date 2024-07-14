import { Environment, OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { ItemWithUrl } from "./shared/ItemWithUrl";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ItemWithUrlIdle } from "./shared/ItemWIthUrlIdle";
import ItemWithUrlSpin from "./shared/ItemWithUrlSpin";
import { LightProbeHelper } from "three-stdlib";

const items = [
  {
    name: "Floor",
    fileType: "glb",
    position: [0, -0.3, 0],
    scale: [25, 2.5, 20],
    rotation: 0,
  },
  {
    name: "LargeBuilding",
    fileType: "glb",
    position: [0, 0, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "LargeBuilding2",
    fileType: "glb",
    position: [4.5, 0, 3.8],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "LargeBuilding2",
    fileType: "glb",
    position: [4.5, 4, 3.8],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "Skyscrapers",
    fileType: "glb",
    position: [10, 0, 4],
    scale: [-0.040, 0.040, 0.040],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, -0.8],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, 1.06],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "HoveTank",
    fileType: "glb",
    position: [-2.8, 0.5, 0.5],
    rotation: 0,
    scale: [2, 2, 2],
  },
  {
    name: "BladeRunnerMemory",
    fileType: "glb",
    position: [-3.2, 1.48, 0],
    rotation: 0,
    scale: [1, 1, 1],
  },
  {
    name: "BladeRunnerMemory",
    fileType: "glb",
    position: [-2.5, 1.48, -0.7],
    rotation: 0,
    scale: [1, 1, 1],
  },
  {
    name: "Probodobodyne",
    fileType: "glb",
    position: [-5.8, 0, 0],
    rotation: 0,
    scale: [0.5, 0.5, 0.5],
  },
  {
    name: "SecurityCamera",
    fileType: "glb",
    position: [-2.15, 0.95, -1.8],
    rotation: 0,
    scale: [0.06, 0.06, 0.06],
  },
  {
    name: "SecurityCamera",
    fileType: "glb",
    position: [1.9, 0.95, -2.15],
    rotation: 3,
    scale: [0.06, 0.06, 0.06],
  },
  {
    name: "PlasmaTurret",
    fileType: "glb",
    position: [-1.4, 5.2, -1.4],
    rotation: 3.2,
    scale: [0.25, 0.25, 0.25],
    spinSpeed: 0,
    spinAxis: 'y'
  },
  {
    name: "Factory",
    fileType: "glb",
    position: [-4, 0, 8.4],
    rotation: 0,
    scale: [0.005, 0.005, 0.005],
    spinSpeed: 0,
    spinAxis: 'y'
  },
  {
    name: "Crane",
    fileType: "glb",
    position: [-12.5, -0.2, 5.4],
    rotation: 3,
    scale: [1, 1, 1],
    spinSpeed: 0,
    spinAxis: 'y'
  },
  {
    name: "AngryRoboDancer",
    fileType: "glb",
    position: [-4, 6.2, 5.2],
    rotation: 0,
    scale: [0.25, 0.25, 0.25],
    spinSpeed: 0,
    spinAxis: 'y'
  },
  // {
  //   name: "SimpleRobot",
  //   fileType: "glb",
  //   position: [-4, 6.2, 4],
  //   rotation: -3,
  //   scale: [2, 2, 2],
  //   spinSpeed: 0,
  //   spinAxis: 'y'
  // },
  {
    name: "Highway",
    fileType: "glb",
    position: [80, 0, 170],
    scale: [-0.040, 0.040, -0.040],
    rotation: 0,
    rotateZ: 0,
  },
  {
    name: "lowpolycity",
    fileType: "glb",
    position: [0, 5, 80],
    scale: [7.5, 7.5, 7.5],
    rotation: 0,
    rotateZ: 0,
  },
  {
    name: "lowpolycity",
    fileType: "glb",
    position: [-40, 5, 80],
    scale: [7.5, 7.5, 7.5],
    rotation: 0,
    rotateZ: 0,
  },
];

const idleItems = [
  {
    name: "VRDRONE",
    fileType: "glb",
    position: [2, 2, -3],
    rotation: 2.2,
    scale: [0.25, 0.25, 0.25],
    idleAnimation: true,
    idleSpeed: 1,
    idleAmplitude: 1.5,
    idleAxis: 'x',
    haslight: true,
    lightIntensity: 1,
    lightRotationY: 0.32,
  },
  {
    name: "VRDRONE",
    fileType: "glb",
    position: [-3, 3, 3],
    rotation: 0,
    scale: [-0.25, 0.25, 0.25],
    idleAnimation: true,
    idleSpeed: 1,
    idleAmplitude: 1,
    idleAxis: 'xy',
    haslight: true,
    lightIntensity: 0.8,
    lightRotationY: 4.2,
  },
  // {
  //   name: "SpaceDude",
  //   fileType: "glb",
  //   position: [1.5, 0.38, -2.2],
  //   rotation: 0,
  //   scale: [-0.25, 0.25, 0.25],
  //   idleAnimation: true,
  //   idleSpeed: 7.5,
  //   idleAmplitude: 0.005,
  //   idleAxis: 'y'
  // },
  {
    name: "GenericRoboDude",
    fileType: "glb",
    position: [1.5, 0.38, -2.2],
    rotation: 1.9,
    scale: [0.6, 0.6, 0.6],
    idleAnimation: true,
    idleSpeed: 7.5,
    idleAmplitude: 0.005,
    idleAxis: 'y'
  },
  {
    name: "GenericRoboDude",
    fileType: "glb",
    position: [-1.2, 0.38, -2.2],
    rotation: 2.6,
    scale: [0.6, 0.6, 0.6],
    idleAnimation: true,
    idleSpeed: 7.5,
    idleAmplitude: 0.005,
    idleAxis: 'y'
  },
  // {
  //   name: "SpaceDude",
  //   fileType: "glb",
  //   position: [-1.2, 0.38, -2.2],
  //   rotation: 0,
  //   scale: [-0.25, 0.25, 0.25],
  //   idleAnimation: true,
  //   idleSpeed: 7.5,
  //   idleAmplitude: 0.005,
  //   idleAxis: 'y'
  // }
]

const itemSpin = [
  {
    name: "GeodesicDome",
    fileType: "glb",
    position: [-5.8, 0.5, 0],
    rotation: 0,
    scale: [0.1, 0.1, 0.1],
    spinSpeed: 2,
    spinAxis: 'y',
  },
  {
    name: "Satellitedish",
    fileType: "glb",
    position: [1.2, 5, -1.4],
    rotation: 0,
    scale: [0.05, 0.05, 0.05],
    spinSpeed: 0.5,
    spinAxis: 'y',
  }
]

const reactLightPosY = [0.48, 1.48, 2.48, 3.48, 4.48];

export const HomeEnvironment = () => {
  const { camera } = useContext(GameContext);

  // Add this inside your component or as a separate hook if needed
  const backgroundTexture = useLoader(TextureLoader, '/images/sky.jpg');

  return (
    <>
      {camera === 2 && <OrbitControls />}

      {/* Background */}
      <mesh scale={[5, 5, -5]} position={[60, 100, 80]}> 
        <planeGeometry attach="geometry" args={[50, 50]} /> 
        <meshBasicMaterial attach="material" map={backgroundTexture} />
      </mesh>

      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 4, 0]} intensity={0.01} scale={[0, 0, 0]} />

      {/* Light in main building */}
      {reactLightPosY.map((posY) => (
        <rectAreaLight
          intensity={5}
          width={4}
          height={0.15}
          color="#083bb2"
          rotation={[(5.9 * Math.PI) / 2, 0, 0]}
          position={[0.2, posY, -2.4]} />
      ))}

      {/* Yellow light */}
      <rectAreaLight
        intensity={1.5}
        width={5}
        height={3.5}
        color="#f5e2ae"
        rotation={[(6 * Math.PI) / 2, 4.8, 0]}
        position={[-8, 4.2, -3]} />

      {/* Tank light */}
      <pointLight position={[-2.8, 0.5, 0]} intensity={0.5} />

      {/* Left street light  */}
      <pointLight position={[8, 2, -2]} intensity={4} color="#f5e2ae" />

      {/* Street light */}
      <pointLight position={[2, 6, 35]} intensity={10} color="#f5e2ae" />
      <pointLight position={[-12, 6, 35]} intensity={10} color="#f5e2ae" />
      <pointLight position={[-22, 6, 35]} intensity={10} color="#f5e2ae" />

      {/* City light */}
      <pointLight position={[15, 10, 60]}  rotation={[0,0,0]} intensity={15} color="#ffffff" />
      <pointLight position={[5, 10, 60]}  rotation={[0,0,0]} intensity={30} color="#ffffff" />
      <pointLight position={[-22, 10, 54]}  rotation={[0,0,0]} intensity={30} color="#ffffff" />
      <pointLight position={[-38, 10, 54]}  rotation={[0,0,0]} intensity={50} color="#ffffff" />

      <fog attach="fog" args={["#0891b2", -25, 250]} />

      {/* <spotLight position={[-8, 4.2, -3]} intensity={10} angle={2} penumbra={0.7} /> */}

      <spotLight position={[-13, 9, 5.4]} intensity={10} angle={2} penumbra={0.7} />

      <spotLight position={[-6.5, 5.5, 5.4]} intensity={10} angle={4} penumbra={0.8 } />
      <spotLight position={[-4, 1.5, 7.4]} intensity={2} angle={4} penumbra={0.8 } />

      {items.map((item, index) => (
        <ItemWithUrl key={index} item={item} sceneName="home" />
      ))}
      {idleItems.map((item, index) => (
        <ItemWithUrlIdle key={index} item={item} sceneName="home" />
      ))}
      {itemSpin.map((item, index) => (
        <ItemWithUrlSpin key={index} item={item} sceneName="home" />
      ))}

      /
    </>
  );
};
