import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import Assistant2D from "../game_object/AssistantRobot2D";
import { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext";

const AssistantBotController = () => {
  const [animation, setAnimation] = useState<string>("idle");
  const { isInteracting, setIsInteracting ,currentHit,setCurrentHit} = useContext(GameContext);

  return (
    <group>
      <RigidBody
        name="assistant-bot"
        type="dynamic"
        position={[-4, 0, 0]}
        gravity={true}
        linearDamping={10}
        mass={50}
        gravityScale={9.8}
        lockRotations
        lockTranslations
        colliders={false}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            if (setCurrentHit) {
              setCurrentHit("assistant-bot");
            }
          }
        }}
        onCollisionExit={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === "player"
          ) {
            if (setCurrentHit) {
              setCurrentHit("");
            }
          }
        }}
      >
        <group>
          <Assistant2D animation={animation} />
          <CapsuleCollider
            args={[
              1.5, // radius
              2.25, // height
            ]}
            position={[1, 4, 4]}
          />
        </group>
        <mesh castShadow position={[0.75, 0.5, 4.3]} scale={[1.5, 0.1, 0.75]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial transparent={true} opacity={0} />
          </mesh>
      </RigidBody>
    </group>
  );
};
export default AssistantBotController;
