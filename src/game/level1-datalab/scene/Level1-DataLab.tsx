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
import { Physics } from "@react-three/rapier";
import { GameContext } from "../../../contexts/GameContext";
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
  useKeyboardControls,
} from "@react-three/drei";
import { TutorialEnvironment } from "../../tutorial/scene-object/Tutorial";
import AssistantBotController from "../../../controllers/AssistantBotController";
import EnemySimple from "../../game_object/enemy/Spider2D";
import RobotIdle from "../../assets/assistant-bot/gif/Idle.gif";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import { Level1DataLabEnvironment } from "../scene-object/Level1-DataLab";
import { MeterGroup } from "primereact/metergroup";
import EnemyGuardController from "../../../controllers/EnemyGuardController";
import EnemyFollowController from "../../../controllers/EnemyFollowController";
import FadeTransition from "../../../components/scene-transition/FadeTransition";
import GuardDataPanelUI from "../scene-object/GuardDataPanelUI";
import { Toast } from "primereact/toast";
import { degreeNumberToRadian } from "../../../utils";
import { SecurityCamera } from "../scene-object/room/SecurityCamera";
import LootBoxUI from "../ui/LootBoxUI";
import CameraDataPanelUI from "../ui/CameraDataPanelUI";
import ChatwithGoodBot from "../ui/ChatwithGoodBot";
import CheckListGuideUI from "../ui/CheckListGuideUI";

interface HomeProps {}

const Level1DataLab: React.FC<HomeProps> = () => {
  const { debug, currentCamera,isUsingSecurityCamera,isInteracting,currentHit } = useContext(GameContext);

  const controlMap = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.coding, keys: ["KeyE"] },
      { name: Controls.interact, keys: ["KeyR"] },
      { name: Controls.ESC, keys: ["Escape"] },
      { name: Controls.L, keys: ["KeyL"] },
    ],
    []
  );

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

  const [showDialog, setShowDialog] = useState(false);
  const [isOpenChest, setIsOpenChest] = useState(false);
  const [isOpenDataCamera, setIsOpenDataCamera] = useState(false);
  const craneUpNotAllow = useRef(null);
  const securityCameraRef = useRef(null);

  const [imageCollectedList, setImageCollectedList] = useState([]);
  const [textCollectedList, setTextCollectedList] = useState([]);
  const [audioCollectedList, setAudioCollectedList] = useState([]);

  const [confirmSelectedItems, setConfirmSelectedItems] = useState([]);
  const dataCollectNotify = useRef(null);

  return (
    <>
      <Toast ref={craneUpNotAllow} position="top-center" />
      <Toast ref={dataCollectNotify} position="top-right" />
      {/* <FadeTransition/> */}
      <GuardDataPanelUI
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        values={values}
        inputValues={inputValues}
        preparedImages={["/images/guard-profile.png"]}
        selectedIndices={[0]}
        toggleSelection={(index) => console.log(index)}
      />

      {isOpenChest && <LootBoxUI 
        confirmSelectedItems={confirmSelectedItems}
        setConfirmSelectedItems={setConfirmSelectedItems}
        dataCollectNotify={dataCollectNotify}
      />}
      {isOpenDataCamera && <CameraDataPanelUI
        collectedList={imageCollectedList}
        setCollectedList={setImageCollectedList}
        dataCollectNotify={dataCollectNotify}
      />}
      {
        isInteracting && currentHit==="GoodBot" && (
          <ChatwithGoodBot
            confirmSelectedItems={confirmSelectedItems}
            dataCollectNotify={dataCollectNotify}
            textCollectedList={textCollectedList}
            setTextCollectedList={setTextCollectedList}
            audioCollectedList={audioCollectedList}
            setAudioCollectedList={setAudioCollectedList}
          />
        )
      }
      {
        <CheckListGuideUI
          textCollectedList={textCollectedList}
          imageCollectedList={imageCollectedList}
          audioCollectedList={audioCollectedList}
        />
      }

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
          {/* <PerspectiveCamera makeDefault position={[0, 2, 10]} /> */}
          <ambientLight intensity={0.5} color={"lightblue"} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              {/* <EnemyGuardController
                speed={3}
                point1={[-6, 3, -10]}
                point2={[-6, 3, 10]}/> */}
              {/* <EnemyFollowController
                speed={8}
                position={[-8, 15, 0]}
                idleAreaRadius={8}
                chasingAreaRadius={4}
                texture="spider"
              /> */}
              {/* <AssistantBotController /> */}
              <Level1DataLabEnvironment
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                craneUpNotAllow={craneUpNotAllow}
                isOpenChest={isOpenChest}
                setIsOpenChest={setIsOpenChest}
                isOpenDataCamera={isOpenDataCamera}
                setIsOpenDataCamera={setIsOpenDataCamera}
              />
            </Physics>
          </Suspense>
          {isUsingSecurityCamera && <SecurityCamera cameraRef={securityCameraRef} />}
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level1DataLab;
