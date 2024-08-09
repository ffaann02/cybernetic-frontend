import { Environment } from "@react-three/drei";
import { MapRoom1 } from "../map/MapRoom1";
import { Item } from "../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../utils";
import { RigidBody } from "@react-three/rapier";

const SceneObject = () => {
  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.5} />
      <directionalLight
        intensity={4}
        scale={100}
        castShadow
        shadow-mapSize-height={4096 * 3}
        shadow-mapSize-width={4096 * 3}
        rotation={[0, 0, 0]}
        position={[-2, 8, 2]}
        shadow-camera-left={-20}
        shadow-camera-right={40}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <RigidBody
        name="Platform01"
        type="fixed"
        colliders="trimesh"
        lockRotations
        lockTranslations
        position={[-3.6, 7.5, 11.4]}
        scale={[400, 400, 250]}
        mass={20}
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(90),
        ]}
      >
        <Item
          item={{
            name: "ScifiPlatform-01",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1],
          }}
        />
      </RigidBody>
      <MapRoom1 />
    </>
  );
};
export default SceneObject;
