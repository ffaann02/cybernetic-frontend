import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { useLevel1Context } from "../../../../contexts/SceneContext/Level1Context";
import { useContext } from "react";
import { GameContext } from "../../../../contexts/GameContext";

const Object = ({ items }: { items: any }) => {
  const { setCurrentHit } = useContext(GameContext);
  const {
    craneRedBox,
    setAllowRedPad,
    setAllowGreenPad,
    allowRedPad,
    allowGreenPad,
  } = useLevel1Context();
  const onColliderRedPadEnter = ({ other }) => {
    console.log(other.rigidBodyObject.name);
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "RedBox") {
        console.log("helloawdawd");
        setAllowRedPad(true);
      }
    }
  };

  const onColliderRedPadExit = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "RedBox") {
        setAllowRedPad(false);
      }
    }
  };

  const onColliderGreenPadEnter = ({ other }) => {
    if (other.rigidBodyObject.name) {
      if (other.rigidBodyObject.name === "GreenBox") {
        setAllowGreenPad(true);
      }
    }
  };

  const onColliderGreenPadExit = ({ other }) => {
    if (other.rigidBodyObject) {
      console.log(other.rigidBodyObject.name);
      if (other.rigidBodyObject.name === "GreenBox") {
        setAllowGreenPad(false);
      }
    }
  };

  return (
    <>
      <RigidBody mass={20} name="RedBox">
        <Item
          item={{
            name: "WeightBox",
            position: [-22.5, 15, 0.5],
            scale: [200, 200, 200],
            fileType: "glb",
            color: "red",
          }}
        />
      </RigidBody>
      <RigidBody mass={20} name="GreenBox">
        <Item
          item={{
            name: "WeightBox",
            position: [-17, 4, 4],
            scale: [200, 200, 200],
            fileType: "glb",
            color: "green",
          }}
        />
      </RigidBody>
      <RigidBody
        ref={craneRedBox}
        scale={[0.25, 0.25, 0.5]}
        position={[-24, 10, -5]}
        colliders="trimesh"
        name="craneRedBox"
        lockRotations
        lockTranslations
        type="fixed"
        rotation={[
          degreeNumberToRadian(-90),
          degreeNumberToRadian(0),
          degreeNumberToRadian(180),
        ]}
      >
        <mesh castShadow position={[-17, 8, -12]}>
          <boxGeometry args={[2, 2, 16]} />
          <meshStandardMaterial
            color={"yellow"}
            opacity={0.9}
            transparent={true}
          />
        </mesh>
        <mesh castShadow position={[-18, 10, -19]}>
          <boxGeometry args={[16, 16, 0.25]} />
          <meshStandardMaterial
            color={"yellow"}
            opacity={0.9}
            transparent={true}
          />
        </mesh>
        <Item
          item={{
            name: "crane",
            position: [-17, 8, -2],
            scale: [1, 1, 1],
            fileType: "fbx",
          }}
          opacity={0.9}
        />
      </RigidBody>
      <RigidBody
        colliders={false}
        type="fixed"
        lockRotations
        lockTranslations
        position={items[1].position}
        scale={[1, 1, 1]}
        onCollisionEnter={onColliderRedPadEnter}
        onCollisionExit={onColliderRedPadExit}
      >
        <CuboidCollider args={[0.7, 0.5, 0.7]} position={[-6.9, 0.05, -6]} />
        <Item item={items[1]} key={"pad1"} opacity={0.8} />
      </RigidBody>
      <RigidBody
        colliders="trimesh"
        type="fixed"
        lockRotations
        lockTranslations
        position={items[0].position}
        scale={[1, 1, 1]}
        onCollisionEnter={onColliderGreenPadEnter}
        onCollisionExit={onColliderGreenPadExit}
      >
        <CuboidCollider args={[0.7, 0.5, 0.7]} position={[-1.2, 0.1, -6]} />
        <Item item={items[0]} key={"pad2"} opacity={0.8} />
      </RigidBody>
    </>
  );
};
export default Object;
