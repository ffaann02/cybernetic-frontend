import { RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../utils";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { Item } from "./Item";

const ScifiComputer = () => {
  const { currentHit, setCurrentHit } = useContext(GameContext);

  return (
    <RigidBody
      colliders="trimesh"
      type="fixed"
      name="computer"
      position={[-22, 0, 12]}
      rotation={[
        degreeNumberToRadian(-90),
        degreeNumberToRadian(0),
        degreeNumberToRadian(-30),
      ]}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
          if (setCurrentHit) {
            setCurrentHit("computer");
          }
        }
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject && other.rigidBodyObject.name === "player") {
          if (setCurrentHit) {
            setCurrentHit("");
          }
        }
      }}
    >
      <Item
        item={{
          name: "scifi_computer",
          position: [0, 0, 0],
          rotation: 0,
          scale: [2, 2, 2],
          fileType: "glb",
        }}
        key={1}
      />
    </RigidBody>
  );
};
export default ScifiComputer;
