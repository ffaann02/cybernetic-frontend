import { Environment, OrbitControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { ItemWithUrl } from "../../shared-object/object/ItemWithUrl";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ItemWithUrlIdle } from "../../shared-object/object/ItemWIthUrlIdle";
import ItemWithUrlSpin from "../../shared-object/object/ItemWithUrlSpin";
import { LightProbeHelper } from "three-stdlib";
import { items, idleItems, itemSpin } from "./items";


const reactLightPosY = [0.48, 1.48, 2.48, 3.48, 4.48];

export const SceneObject = () => {
  // const { camera } = useContext(GameContext);

  // Add this inside your component or as a separate hook if needed
  const backgroundTexture = useLoader(TextureLoader, '/images/sky.jpg');

  return (
    <>
      {/* {camera === 2 && <OrbitControls />} */}

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
      {/* {idleItems.map((item, index) => (
        <ItemWithUrlIdle key={index} item={item} sceneName="home" />
      ))}
      {itemSpin.map((item, index) => (
        <ItemWithUrlSpin key={index} item={item} sceneName="home" />
      ))} */}
    </>
  );
};
