import { RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../utils";

interface WallProps {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}

const Wall = ({ color, position, scale, rotation }: WallProps) => {
  return (
    <group>
      <RigidBody
        lockTranslations
        lockRotations
        position={position}
        scale={scale}
        rotation={[
          degreeNumberToRadian(rotation[0]),
          degreeNumberToRadian(rotation[1]),
          degreeNumberToRadian(rotation[2]),
        ]}
      >
        <mesh>
          <boxGeometry args={[10, 3, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        lockTranslations
        lockRotations
        position={[position[0], position[1] + 3, position[2]]}
        rotation={[
          degreeNumberToRadian(rotation[0]),
          degreeNumberToRadian(rotation[1]),
          degreeNumberToRadian(rotation[2]),
        ]}
        scale={scale}
      >
        <mesh>
          <boxGeometry args={[10, 3, 0.1]} />
          <meshStandardMaterial opacity={0} transparent />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Wall;
