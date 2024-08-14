import { CuboidCollider, RigidBody, vec3 } from "@react-three/rapier";
import { Item } from "../../../shared-object/object/Item";
import { degreeNumberToRadian } from "../../../../utils";
import { useLevel1Context } from "../../../../contexts/SceneContext/Level1Context";
import { useContext, useState } from "react";
import { GameContext } from "../../../../contexts/GameContext";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../../../controllers/CharacterController";

const Object = ({ items }: { items: any }) => {
  const {currentHit,setCurrentHit, isCarryingObject, setIsCarryingObject,playerRigidBody } = useContext(GameContext);
  const {
    craneRedBox,
    setAllowRedPad,
    setAllowGreenPad,
    allowRedPad,
    allowGreenPad,
    greenBoxRef,
    redBoxRef,
  } = useLevel1Context();

  const ePressed = useKeyboardControls((state) => state[Controls.coding]);
  const [lastPressTime, setLastPressTime] = useState(0);
  const [currentBox, setCurrentBox] = useState("");

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

  const onPlayerEnterGreenBox = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "player") {
        setCurrentHit("GreenBox");
        setCurrentBox("Green");
      }
    }
  };

  const onPlayerExitGreenBox = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "player") {
        setCurrentHit("");
      }
    }
  };

  const onPlayerEnterRedBox = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "player") {
        setCurrentHit("RedBox");
        setCurrentBox("Red");
      }
    }
  };

  const onPlayerExitRedBox = ({ other }) => {
    if (other.rigidBodyObject) {
      if (other.rigidBodyObject.name === "player") {
        setCurrentHit("");
      }
    }
  };

  useFrame(() => {
    if (ePressed && currentHit === "GreenBox") {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        setLastPressTime(currentTime);
        setIsCarryingObject(true);
        setCurrentBox("Green");
      }
    }

    if(ePressed && currentHit==="RedBox"){
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        // 500 milliseconds debounce time
        setLastPressTime(currentTime);
        setIsCarryingObject(true);
        setCurrentBox("Red");
      }
    }

    if(ePressed && currentBox==="Green"){
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsCarryingObject(false);
        setCurrentBox("");
        setLastPressTime(currentTime);
      }
    }

    if(ePressed && currentBox==="Red"){
      const currentTime = new Date().getTime();
      if (currentTime - lastPressTime > 200) {
        setIsCarryingObject(false);
        setCurrentBox("");
        setLastPressTime(currentTime);
      }
    }
  },-2);

  useFrame(() => {
    if (isCarryingObject && currentBox==="Green") {
      const playerPosition = vec3(playerRigidBody.current.translation());
      greenBoxRef.current.setTranslation({
        x: playerPosition.x,
        y: playerPosition.y+8,
        z: playerPosition.z,
      },true);
    }

    if (isCarryingObject && currentBox==="Red") {
      const playerPosition = vec3(playerRigidBody.current.translation());
      redBoxRef.current.setTranslation({
        x: playerPosition.x,
        y: playerPosition.y+8,
        z: playerPosition.z,
      },true);
    }
  },-1);

  return (
    <>
      <RigidBody
        ref={redBoxRef}
        name="GreenBox"
        type="dynamic"
        colliders={false}
        onCollisionEnter={onPlayerEnterRedBox}
        onCollisionExit={onPlayerExitRedBox}
        position={[-14.5, 16, 0.5]}
        mass={60}
        lockRotations
        lockTranslations={false}
      >
        <CuboidCollider args={[1.25, 1, 1.25]} position={[0, 0.1, 0]} />
        <Item
          item={{
            name: "WeightBox",
            position: [0, 0, 0],
            scale: [200, 200, 200],
            fileType: "glb",
            color: "red",
          }}
        />
      </RigidBody>
      <RigidBody
        ref={greenBoxRef}
        name="GreenBox"
        type="dynamic"
        colliders={false}
        onCollisionEnter={onPlayerEnterGreenBox}
        onCollisionExit={onPlayerExitGreenBox}
        position={[-17, 2, 4]}
        mass={60}
        lockRotations
        lockTranslations={false}
      >
        <CuboidCollider args={[1.25, 1, 1.25]} position={[0, 0, 0]} />
        <Item
          item={{
            name: "WeightBox",
            position: [0, 0, 0],
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
