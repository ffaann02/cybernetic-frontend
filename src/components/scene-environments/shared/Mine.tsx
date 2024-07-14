import { RigidBody } from "@react-three/rapier";
import { Item } from "./Item";
import { degreeNumberToRadian } from "../../../utils";

export const Mine = ({ mine, index, setMines }) => {
  return (
    <RigidBody
      colliders="trimesh"
      key={index}
      position={[mine.position.x + 1, mine.position.y + 2, mine.position.z + 5]}
      lockRotations
      rotation={[
        degreeNumberToRadian(-90),
        degreeNumberToRadian(0),
        degreeNumberToRadian(-45),
      ]}
      type="dynamic"
      mass={10}
      onCollisionEnter={({ other }) => {
        if (
          other.rigidBodyObject &&
          other.rigidBodyObject.name.includes("enemy")
        ) {
          console.log("Hit mine");
          setMines((prevMines) => prevMines.filter((_, i) => i !== index));
        }
      }}
    >
      <Item
        item={{
          name: "Landmine",
          position: [0, 0, 0],
          rotation: 0,
          scale: [50, 50, 20],
          fileType: "glb",
        }}
        opacity={1}
      />
    </RigidBody>
  );
};
