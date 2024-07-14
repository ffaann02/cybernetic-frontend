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

interface HomeProps {}

const Level1DataLab: React.FC<HomeProps> = () => {
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
  const rigidBody = useRef<any>(null);

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
          <div>
            <Fieldset
              legend="Robot Guard"
              className="-ml-2 z-[20] relative px-2 mt-4 min-w-80 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
            >
              <div className="text-white">
                <h2 className="text-xl">
                  I'm an elevator controller robot. If you want to go up, please
                  give me the data source as a token. I will check if you have
                  the right token to go up.
                </h2>
                <div className="grid grid-cols-6 mt-2">
                  <div className="h-80 col-span-2 p-2 relative">
                    <div className="border-2 h-[20%] w-[50%] mx-auto rounded-t-xl border-b-0 -mb-0.5"></div>
                    <div className="border-2 h-[80%] w-[75%] mx-auto rounded-xl relative overflow-hidden">
                      <div className="absolute bottom-0 w-full h-[54%] rounded-b-xl">
                        <div className="h-[44.4%] bg-cyan-400"></div>
                        <div className="h-[24.1%] bg-orange-400"></div>
                        <div className="h-[31.5%] bg-green-400"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col p-4">
                    <div className="w-full bg-white/50 rounded-xl rounded-r-none border-2 overflow-y-scroll h-60 grid grid-cols-6 gap-2 p-2">
                      {/* {Array.from({ length: 10 }).map((_, index) => ( */}
                      {preparedImages.map((src, index) => (
                        <div
                          key={index}
                          className={`h-20 ${
                            selectedIndices.includes(index)
                              ? "border-green-600 border-2 bg-green-400/50"
                              : "border-2 opacity-50"
                          } bg-cyan-400/50 rounded-xl cursor-pointer hover:bg-black/10 flex justify-center items-center`}
                          onClick={() => toggleSelection(index)}
                        >
                          <img src={src} className="w-full h-full p-2" />
                        </div>
                      ))}
                      {/* ))} */}
                    </div>
                  </div>
                </div>
                <div className="px-10">
                  <div className="border px-3 py-1 rounded-lg bg-white/20">
                    <p>Requirement Token</p>
                    <MeterGroup values={values} />
                  </div>
                </div>
                <div className="px-10 mt-2">
                  <div className="border px-3 py-1 rounded-lg bg-red-400/50">
                    <p>Your Input</p>
                    <MeterGroup values={inputValues} />
                  </div>
                </div>
              </div>
            </Fieldset>
          </div>
        </div>
      </div>
      <div
        className={`bg-black/70 h-full w-full fixed bottom-0 z-[1000] 
         justify-center items-center hidden`}
      >
        <div className="flex w-full max-w-3xl gap-x-4 relative">
          <Fieldset
            legend="Security Glass Bridge Checkpoint"
            className="w-full relative px-2 mt-4 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
          >
            <div className="w-full grid grid-cols-3 gap-x-4">
              <div className="col-span-1 border rounded-xl bg-white/30">
                <img src="/images/computer-checkpoint.png" />
              </div>
              <div className="col-span-2 h-full border rounded-xl bg-white/30 p-4">
                <p className="text-white text-lg">
                  There're the invisible danger glass out there. You have to
                  activate the classifier to cross here.
                </p>
                <div className="w-full h-20 p-2 bg-green-400/50 hover:bg-cyan-400/50 border rounded-xl mt-2 flex cursor-pointer">
                  <div className="m-auto flex flex-col text-center gap-y-1">
                    <p className="pi pi-microchip-ai text-3xl"></p>
                    <p>Select AI Classifier</p>
                  </div>
                </div>
                <button className=" mt-2 px-4 py-2 bg-cyan-400 font-bold tracking-wider rounded-lg border-slate-400 border-2">
                  Activate
                </button>
              </div>
            </div>
          </Fieldset>
        </div>
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
              <CharacterController rigidBody={rigidBody} />
              <EnemySimple
                speed={3}
                point1={[-6, 0.5, -10]}
                point2={[-6, 0.5, 10]}
                showPath={true}
              />
              {/* <AssistantBotController /> */}
              <Level1DataLabEnvironment
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                rigidBody={rigidBody}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level1DataLab;
