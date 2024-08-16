import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { degreeNumberToRadian } from "../../../../utils";
import { useContext } from "react";
import { GameContext } from "../../../../contexts/GameContext";
import { GoodBot } from "../../../../GoodBot";

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
        position={[-20, 0, 2]}
        scale={[1.5, 1.5, 1.5]}
        rotation={[
          degreeNumberToRadian(0),
          degreeNumberToRadian(45),
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
        <CuboidCollider args={[1, 2, 1]} position={[0, 2, 0]} />
        <GoodBot animation_index={1} />
      </RigidBody>
    </>
  );
};
export default NPC;
