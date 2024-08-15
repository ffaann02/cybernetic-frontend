import { ProgressSpinner } from "primereact/progressspinner";
import { useContext, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { GameContext } from "../../../contexts/GameContext";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { BiTargetLock } from "react-icons/bi";
import { Accordion, AccordionTab } from "primereact/accordion";

const TrainAIComputerUI = ({ isOpenComputer, setIsOpenComputer }) => {
  const [numCodes, setNumCodes] = useState(18); // Number of secret codes
  const [selectedMission, setSelectedMission] = useState(1); // State for selected mission
  const { setIsInteracting, setCurrentHit } = useContext(GameContext);
  const [epochValue, setEpochValue] = useState(2);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [optimizer, setOptimizer] = useState("adam");
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState(0);

  const handleClose = () => {
    setIsOpenComputer(false);
    setIsInteracting(false);
    setCurrentHit("");
  };

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
  };

  const handleEpochChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpochValue(Number(event.target.value));
  };

  const handleLearningRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLearningRate(Number(event.target.value));
  };

  const handleBatchSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBatchSize(Number(event.target.value));
  };

  const handleOptimizerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOptimizer(event.target.value);
  };

  const handleTrainAI = () => {
    setIsTraining(true);
    setTrainingResult(null);
    setCurrentEpoch(0);

    const trainEpoch = (epoch) => {
      setTimeout(() => {
        setCurrentEpoch(epoch);
        if (epoch < epochValue) {
          trainEpoch(epoch + 1);
        } else {
          setIsTraining(false);
          setTrainingResult({
            accuracy: (Math.random() * 100).toFixed(2),
            precision: (Math.random() * 100).toFixed(2),
            recall: (Math.random() * 100).toFixed(2),
            f1Score: (Math.random() * 100).toFixed(2),
            loss: (Math.random() * 100).toFixed(2),
            trainingTime: (Math.random() * 10).toFixed(2),
          });
        }
      }, 1000); // Simulate each epoch taking 1 second
    };

    trainEpoch(1);
  };

  const clearAll = () => {
    setEpochValue(2);
    setLearningRate(0.001);
    setBatchSize(32);
    setOptimizer("adam");
    setIsTraining(false);
    setTrainingResult(null);
  };

  return (
    <div
      className="max-w-5xl mx-auto w-full h-[60vh] mt-20 bg-cyan-400/50 absolute inset-0 z-50 flex overflow-y-scroll 
      flex-col items-start justify-start rounded-xl border-2 pt-2 pl-4 pr-2"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <IoMdCloseCircleOutline
        className="text-4xl text-red-500 absolute top-1 right-1 cursor-pointer"
        onClick={handleClose}
      />
      <div className="w-full border-b -ml-2">
        <p className="text-2xl font-semibold text-slate-200">Train Computer</p>
      </div>
      <div className="w-full grid grid-cols-6 mt-4 h-full pb-4 gap-x-2">
        <div className="col-span-4 border-2 rounded-xl bg-white/50">
          <div className="w-full bg-white -mt-0.5 rounded-t-lg p-2 pl-3 flex justify-between">
            <p className="text-slate-500 font-semibold text-xl tracking-wide">
              {selectedMission === 1 &&
                "Mission 1: Develop a AI to classify the images using CNN"}
              {selectedMission === 2 &&
                "Mission 2: Develop a AI to solve Maze in 45 seconds"}
              {selectedMission === 3 &&
                "Mission 3: Develop a AI to recognize the unseen character"}
            </p>
          </div>
          <div className="w-full grid grid-cols-6 gap-2 mt-4 pl-4 pr-2">
            {selectedMission === 1 && (
              <div className="col-span-full">
                {!isTraining && !trainingResult && (
                  <Accordion className="w-full">
                    <AccordionTab header="Data Preparation"></AccordionTab>
                    <AccordionTab header="Hyper Parameters">
                      <div className="flex flex-col gap-y-2">
                        <div className="px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
                          <label className="text-lg text-slate-500 font-semibold my-auto">
                            Learning Rate
                          </label>
                          <input
                            className="w-full accent-cyan-400 px-2 py-1 rounded-md border"
                            type="number"
                            step="0.0001"
                            value={learningRate}
                            onChange={handleLearningRateChange}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
                          <label className="text-lg text-slate-500 font-semibold my-auto">
                            Batch Size
                          </label>
                          <input
                            className="w-full accent-cyan-400 px-2 py-1 rounded-md border"
                            type="number"
                            step="1"
                            value={batchSize}
                            onChange={handleBatchSizeChange}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
                          <label className="text-lg text-slate-500 font-semibold my-auto">
                            Optimizer
                          </label>
                          <select
                            className="w-full accent-cyan-400 px-2 py-1 rounded-md border"
                            value={optimizer}
                            onChange={handleOptimizerChange}
                            style={{ cursor: "pointer" }}
                          >
                            <option value="adam">Adam</option>
                            <option value="sgd">SGD</option>
                            <option value="rmsprop">RMSprop</option>
                          </select>
                        </div>
                      </div>
                    </AccordionTab>
                    <AccordionTab header="Network Architecture">
                      <p className="-mt-2">Activation Functions</p>
                      <div className="px-2 grid grid-cols-3 gap-x-3 gap-y-1 mt-2">
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/activation-function/Linear.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/activation-function/ReLU.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/activation-function/Sigmoid.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <p className="mx-auto text-center font-semibold">
                          Linear
                          <br />
                          <span className="font-normal text-slate-500">
                            f(x) = x
                          </span>
                        </p>
                        <p className="mx-auto text-center font-semibold">
                          ReLU
                          <br />
                          <span className="font-normal text-slate-500">
                            f(x) = max(0,x)
                          </span>
                        </p>
                        <p className="mx-auto text-center font-semibold">
                          Sigmoid
                          <br />
                          <span className="font-normal text-slate-500">
                            f(x) = 1/(1+e^-x)
                          </span>
                        </p>
                      </div>
                      <p className="-mt-2">Additional Layers</p>
                      <div className="px-2 grid grid-cols-3 gap-x-3 gap-y-1 mt-2">
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/layers/Conv2D.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/layers/MaxPooling2D.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <div className="px-1 py-1 bg-cyan-100 border border-slate-400 rounded-lg relative overflow-hidden">
                          <img
                            src="/images/layers/Dropout.png"
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                        <p className="mx-auto text-center font-semibold">
                          Conv2D
                          <br />
                          <span className="font-normal text-slate-500">
                            Convolutional Layer
                          </span>
                        </p>
                        <p className="mx-auto text-center font-semibold">
                          MaxPooling2D
                          <br />
                          <span className="font-normal text-slate-500">
                            Max Pooling Layer
                          </span>
                        </p>
                        <p className="mx-auto text-center font-semibold">
                          Dropout
                          <br />
                          <span className="font-normal text-slate-500">
                            Dropout Layer
                          </span>
                        </p>
                      </div>
                    </AccordionTab>
                    <AccordionTab header="Training Configuration">
                      <div className="flex flex-col gap-y-2">
                        <div className="px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
                          <div className="flex w-full justify-between">
                            <p className="text-lg text-slate-500 font-semibold my-auto">
                              Epoch
                            </p>
                            <p className="text-sm px-1 text-slate-500 my-auto">
                              Current: {epochValue}
                            </p>
                          </div>
                          <input
                            className="w-full accent-cyan-400"
                            type="range"
                            id="epochStepper"
                            min="2"
                            max="40"
                            step="1"
                            list="epochValues"
                            value={epochValue}
                            onChange={handleEpochChange}
                            style={{ cursor: "pointer" }}
                          />
                          <datalist id="epochValues">
                            <option value="2" label="2"></option>
                            <option value="4" label="4"></option>
                            <option value="8" label="8"></option>
                            <option value="12" label="12"></option>
                            <option value="16" label="16"></option>
                            <option value="20" label="20"></option>
                            <option value="32" label="32"></option>
                            <option value="40" label="40"></option>
                          </datalist>
                          <p className="text-sm px-1 text-slate-400 mt-1">
                            Epoch is the number of times the model will be
                            trained on the entire training dataset. The more
                            epochs, the more the model will learn from the data.
                          </p>
                        </div>
                      </div>
                    </AccordionTab>
                  </Accordion>
                )}
                {isTraining && (
                  <div className="w-full flex justify-center mt-4 flex-col">
                    <ProgressSpinner />
                    <p className="mx-auto text-xl mt-2 text-slate-600">
                      Model is training
                    </p>
                    <p className="mx-auto text-lg mt-1 text-cyan-800 font-semibold">
                      Epoch {currentEpoch}/{epochValue}
                    </p>
                  </div>
                )}
                {!isTraining && trainingResult && (
                  <div className="w-full pt-3 p-4 bg-white rounded-lg text-slate-500">
                    <p className="text-lg font-semibold text-slate-600">
                      Training Result
                    </p>
                    <p>Accuracy: {trainingResult.accuracy}%</p>
                    <p>Precision: {trainingResult.precision}%</p>
                    <p>Recall: {trainingResult.recall}%</p>
                    <p>F1-Score: {trainingResult.f1Score}%</p>
                    <p>Loss: {trainingResult.loss}</p>
                    <p>Training Time: {trainingResult.trainingTime} seconds</p>
                  </div>
                )}
                {!isTraining && (
                  <div className="w-full text-right mt-2 flex gap-x-2 justify-end">
                    <button
                      onClick={clearAll}
                      className="mt-auto w-fit mb-2 px-4 py-2 bg-slate-400 text-slate-200 rounded-lg"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleTrainAI}
                      className="mt-auto w-fit mb-2 px-4 py-2 bg-cyan-500 text-white rounded-lg"
                    >
                      Train AI
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2 border-2 rounded-xl bg-white/50 flex flex-col">
          <p className="text-slate-500 text-xl font-semibold text-center mx-auto mt-2.5 tracking-wide flex">
            <BiTargetLock className="text-3xl mr-2 text-cyan-600 my-auto" />
            <span>Mission</span>
          </p>
          <p className="ml-2 mt-2 font-semibold text-slate-500">
            Selected Mission
          </p>
          <div className="mt-2 flex flex-col gap-y-2 px-2">
            <div
              className={`cursor-pointer p-2 rounded-lg transition-all ease-linear duration-100 ${
                selectedMission === 1
                  ? "bg-cyan-500 text-white border-2"
                  : "bg-white text-slate-500"
              }`}
              onClick={() => handleMissionSelect(1)}
            >
              Mission 1: Develop a AI to classify the images using CNN
            </div>
            <div
              className={`cursor-pointer p-2 rounded-lg transition-all ease-linear duration-100 ${
                selectedMission === 2
                  ? "bg-cyan-500 text-white border-2"
                  : "bg-white text-slate-500"
              }`}
              onClick={() => handleMissionSelect(2)}
            >
              Mission 2: Develop a AI to solve Maze in 45 seconds
            </div>
            <div
              className={`cursor-pointer p-2 rounded-lg transition-all ease-linear duration-100 ${
                selectedMission === 3
                  ? "bg-cyan-500 text-white border-2"
                  : "bg-white text-slate-500"
              }`}
              onClick={() => handleMissionSelect(3)}
            >
              Mission 3: Develop a AI to recognize the unseen character
            </div>
          </div>
          <button
            // onClick={handleActivateAI}
            onClick={handleClose}
            className="mt-auto w-[95%] mx-auto mb-2 px-4 py-2 bg-cyan-500 text-white rounded-lg"
          >
            Save AI Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainAIComputerUI;
