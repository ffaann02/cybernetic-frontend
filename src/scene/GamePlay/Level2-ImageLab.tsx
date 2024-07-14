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
} from "../../controllers/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../../contexts/GameContext";
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
  useKeyboardControls,
} from "@react-three/drei";
import { TutorialEnvironment } from "../../components/scene-environments/Tutorial";
import AssistantBotController from "../../controllers/AssistantBotController";
import EnemySimple from "../../game_object/enemy/EnemySimple";
import RobotIdle from "../../assets/assistant-bot/gif/Idle.gif";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import { Level1DataLabEnvironment } from "../../components/scene-environments/Level1-DataLab";
import { MeterGroup } from "primereact/metergroup";
import { Level2ImageLabEnvironment } from "../../components/scene-environments/Level2-ImageLab";

interface HomeProps {}

const Level2ImageLab: React.FC<HomeProps> = () => {
  const { debug, currentCamera } = useContext(GameContext);

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
      value: 17,
      color: "lightgreen",
    },
    {
      label: "Sound",
      value: 13,
      color: "orange",
    },
    {
      label: "Object",
      value: 24,
      color: "cyan",
    },
  ]);

  const [inputValues, setInputValues] = useState([
    {
      label: "Image",
      value: 4,
      color: "lightgreen",
    },
    {
      label: "Sound",
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
  const images = [
    "https://cdn-icons-png.flaticon.com/512/3721/3721901.png",
    "/images/slime_default.png",
    "https://cdn-icons-png.flaticon.com/512/59/59284.png",
    "https://cdn-icons-png.flaticon.com/512/1829/1829552.png",
    "https://cdn-icons-png.flaticon.com/512/3137/3137287.png",
    // Add more image URLs if needed
  ];

  // Step 2: Shuffle the array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Step 3: Sort the array (optional, based on your sorting criteria)
  const sortArray = (array) => {
    return array.sort(); // Simple sort, customize as needed
  };

  // Ensure preparedImages has exactly 20 elements
  const prepareImagesArray = (images) => {
    const shuffledImages = shuffleArray(images);
    const repeatedImages = [];

    // If there are fewer than 20 images, repeat some images to make up the difference
    while (repeatedImages.length < 20) {
      repeatedImages.push(...shuffledImages);
    }

    // Slice the first 20 images
    return repeatedImages.slice(0, 20);
  };

  // Prepare the images array
  const preparedImages = sortArray(prepareImagesArray(images));
  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelection = (index) => {
    setSelectedIndices((prevSelectedIndices) =>
      prevSelectedIndices.includes(index)
        ? prevSelectedIndices.filter((i) => i !== index)
        : [...prevSelectedIndices, index]
    );
  };

  const [securityDoorStep, setSecurityDoorStep] = useState(0);

  return (
    <>
      <div
        className={`bg-black/70 h-full w-full fixed bottom-0 z-[1000] ${
          showDialog ? "flex" : "hidden"
        } justify-center items-center`}
      >
        <div className="flex max-w-4xl gap-x-4 relative">
          <div className="w-[50%] -left-[40%] -bottom-[25%] h-fit absolute -z-0">
            <img
              className="w-full p-2 rounded-full"
              src="/images/guard-profile.png"
            />
          </div>
        </div>
      </div>
      <div
        className={`bg-black/70 h-full w-full fixed bottom-0 z-[1000] 
         justify-center items-center hidden`}
      >
        {" "}
        {securityDoorStep === 0 && (
          <div className="flex w-full max-w-3xl gap-x-4 relative">
            <Fieldset
              legend="Security Door"
              className="w-full relative px-2 mt-4 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
            >
              <div className="w-full grid grid-cols-3 gap-x-4">
                <div className="col-span-1 border rounded-xl bg-white/30 p-2">
                  <img src="/images/password-keypad.png" />
                </div>
                <div className="col-span-2 h-full border rounded-xl bg-white/30 p-4">
                  <p className="text-white text-lg">
                    There're secret character code to unlock this door, you need
                    to find the right token to unlock it.
                  </p>
                  <div className="w-full h-20 p-2 bg-green-400/50 hover:bg-cyan-400/50 border rounded-xl mt-2 flex cursor-pointer">
                    <div className="m-auto flex flex-col text-center gap-y-1">
                      <p className="pi pi-microchip-ai text-3xl"></p>
                      <p>Select OCR Classifier</p>
                    </div>
                  </div>
                  <button
                    className=" mt-2 px-4 py-2 bg-cyan-400 font-bold tracking-wider rounded-lg border-slate-400 border-2"
                    onClick={() => {
                      setSecurityDoorStep((prev) => prev + 1);
                    }}
                  >
                    Activate
                  </button>
                </div>
              </div>
            </Fieldset>
          </div>
        )}
        {securityDoorStep === 1 && (
          <div className="flex w-full max-w-3xl gap-x-4 relative">
            <Fieldset
              legend="Security Door"
              className="w-full relative px-2 mt-4 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
            >
              <div className="w-full grid grid-cols-3 gap-x-4">
                <div className="col-span-1 border rounded-xl bg-white/30 p-2">
                  <img src="/images/password-keypad.png" />
                </div>
                <div className="col-span-2 h-full border rounded-xl bg-white/30 p-4">
                  <div className="w-full grid grid-cols-4 gap-x-2">
                    <div className="bg-green-400/50 h-20 rounded-xl flex border-2 border-green-400">
                      <p className="text-5xl m-auto font-bold pb-2">ᚦ</p>
                    </div>
                    <div className="bg-red-400/50 h-20 rounded-xl flex border-2 border-red-400">
                      <p className="text-5xl m-auto font-bold pb-2">ᛏ</p>
                    </div>
                    <div className="bg-green-400/50 h-20 rounded-xl flex border-2 border-green-400">
                      <p className="text-5xl m-auto font-bold pb-2">ᛞ</p>
                    </div>
                    <div className="bg-green-400/50 h-20 rounded-xl flex border-2 border-green-400">
                      <p className="text-5xl m-auto font-bold pb-2">ᛜ</p>
                    </div>
                  </div>
                  <MeterGroup
                    className="mt-6"
                    values={[
                      {
                        label: "Success",
                        value: 75,
                        color: "lightgreen",
                      },
                      {
                        label: "Failed",
                        value: 25,
                        color: "red",
                      },
                    ]}
                  />
                  <p className="mt-2 text-xl font-bold text-white">Result: <span className="text-green-200">PASS</span></p>
                </div>
              </div>
            </Fieldset>
          </div>
        )}
      </div>
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
            <PerspectiveCamera makeDefault position={[0, 6, 10]} />
          )}
          <ambientLight intensity={0.25} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <EnemySimple
                speed={3}
                point1={[-6, 0.5, -10]}
                point2={[-6, 0.5, 10]}
                showPath={true}
              />
              {/* <AssistantBotController /> */}
              <Level2ImageLabEnvironment
                showDialog={showDialog}
                setShowDialog={setShowDialog}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level2ImageLab;
