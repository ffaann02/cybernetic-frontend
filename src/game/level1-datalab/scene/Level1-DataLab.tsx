import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CharacterController, {
  Controls,
} from "../../../controllers/CharacterController";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { GameContext } from "../../../contexts/GameContext";
import { KeyboardControls, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import SceneObject from "../scene-object/SceneObject";
import GuardDataPanelUI from "../scene-object/GuardDataPanelUI";
import { Toast } from "primereact/toast";
import { SecurityCamera } from "../scene-object/room/SecurityCamera";
import LootBoxUI from "../ui/LootBoxUI";
import CameraDataPanelUI from "../ui/CameraDataPanelUI";
import ChatwithGoodBot from "../ui/ChatwithGoodBot";
import CheckListGuideUI from "../ui/CheckListGuideUI";
import { enemyPartrolProps } from "../scene-object/EnemyDataProps";
import { useLevel1Context } from "../../../contexts/SceneContext/Level1Context";

interface HomeProps {}

const Level1DataLab: React.FC<HomeProps> = () => {
  const {
    debug,
    currentCamera,
    isUsingSecurityCamera,
    isInteracting,
    currentHit,
    controlMap,
  } = useContext(GameContext);
  const {
    isOpenChest,
    isOpenDataCamera,
    craneUpNotAllow,
    imageCollectedList,
    setImageCollectedList,
    dataCollectNotify,
  } = useLevel1Context();
  const [enemyPatrolInScene, setEnemyPatrolInScene] =
    useState(enemyPartrolProps);

  const [values, setValues] = useState([
    {
      label: "Image",
      value: 20,
      color: "lightgreen",
    },
    {
      label: "Audio",
      value: 15,
      color: "orange",
    },
    {
      label: "Object",
      value: 35,
      color: "cyan",
    },
    {
      label: "Text",
      value: 15,
      color: "gray",
    },
    {
      label: "Numerical",
      value: 15,
      color: "red",
    },
  ]);

  const [inputValues, setInputValues] = useState([
    {
      label: "Image",
      value: 4,
      color: "lightgreen",
    },
    {
      label: "Audio",
      value: 6,
      color: "orange",
    },
    {
      label: "Object",
      value: 33,
      color: "cyan",
    },
  ]);

  return (
    <>
      <Toast ref={craneUpNotAllow} position="top-center" />
      <Toast ref={dataCollectNotify} position="top-right" />
      {/* <FadeTransition/> */}
      <GuardDataPanelUI />

      {isOpenChest && <LootBoxUI />}
      {isOpenDataCamera && (
        <CameraDataPanelUI
          collectedList={imageCollectedList}
          setCollectedList={setImageCollectedList}
          dataCollectNotify={dataCollectNotify}
        />
      )}
      {isInteracting && currentHit === "GoodBot" && <ChatwithGoodBot />}
      <CheckListGuideUI />

      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          {/* <fog attach="fog" args={["skyblue", 15, 30]} /> */}
          <color attach="background" args={["black"]} />
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          <ambientLight intensity={0.5} color={"lightblue"} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <SceneObject
                enemyPatrolInScene={enemyPatrolInScene}
                setEnemyPatrolInScene={setEnemyPatrolInScene}
              />
              {isUsingSecurityCamera && (
                <>
                  <SecurityCamera />
                </>
              )}
            </Physics>
          </Suspense>
          {/* <OrbitControls /> */}
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level1DataLab;
