import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../../utils";
import Guard from "../Guard";
import { useContext } from "react";
import { GameContext } from "../../../../contexts/GameContext";

const NPC = () => {

    const {setCurrentHit} = useContext(GameContext);

  return (
    <>
      <RigidBody
        colliders={false}
        name="level1-data-guard-red"
        lockRotations
        lockTranslations
        type="fixed"
        position={[-20, 3.5, 2]}
        scale={[9, 9, 9]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(-45),
          degreeNumberToRadian(0),
        ]}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            setCurrentHit("level1-data-guard-red");
          }
        }}
        onCollisionExit={({ other }) => {
          setCurrentHit("");
        }}
      >
        <CuboidCollider args={[0.15, 0.4, 0.35]} position={[0, 0, 0]} />
        <Guard/>
      </RigidBody>
    </>
  );
};
export default NPC;
