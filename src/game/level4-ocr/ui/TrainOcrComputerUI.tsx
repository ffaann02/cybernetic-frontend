import { ProgressSpinner } from "primereact/progressspinner";
import { useContext, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { GameContext } from "../../../contexts/GameContext";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import { IoMdCloseCircleOutline } from "react-icons/io";

const TrainOcrComputerUI = () => {
  const [numCodes, setNumCodes] = useState(18); // Number of secret codes
  const [password, setPassword] = useState(generateRandomPassword(numCodes));
  const [predictions, setPredictions] = useState(Array(numCodes).fill(null));
  const [accuracy, setAccuracy] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const { setIsInteracting, setCurrentHit } = useContext(GameContext);
  const {
    isOpenOcrPassword,
    setIsOpenOcrPassword,
    setIsOpenCharacterStorage,
    setIsOpenTrainComputer,
    labelCounts,
    setLabelCounts,
  } = useLevel4Context();

  const handleClose = () => {
    setIsOpenTrainComputer(false);
    setIsInteracting(false);
    setCurrentHit("");
  };

  function generateRandomPassword(length) {
    const patterns = [1, 2, 3];
    const characters = ["A", "B", "C", "D", "E", "F"];
    let result = [];

    for (let i = 0; i < length; i++) {
      const randomPattern =
        patterns[Math.floor(Math.random() * patterns.length)];
      const randomCharacter =
        characters[Math.floor(Math.random() * characters.length)];
      result.push({ pattern: randomPattern, character: randomCharacter });
    }

    return result;
  }

  const handleReRandomize = () => {
    setPassword(generateRandomPassword(numCodes));
    setPredictions(Array(numCodes).fill(null));
    setAccuracy(null);
  };

  const handleActivateAI = () => {
    const characters = ["A", "B", "C", "D", "E", "F"];
    let correctPredictions = 0;
    const newPredictions = [...predictions];
    setIsPredicting(true);

    password.forEach((item, index) => {
      setTimeout(() => {
        const randomCharacter =
          characters[Math.floor(Math.random() * characters.length)];
        newPredictions[index] = randomCharacter;

        if (randomCharacter === item.character) {
          correctPredictions++;
        }

        setPredictions([...newPredictions]);

        if (index === password.length - 1) {
          const accuracyPercent = (
            (correctPredictions / numCodes) *
            100
          ).toFixed(2);
          setAccuracy(accuracyPercent);
          setIsPredicting(false);
          console.log(`Accuracy: ${accuracyPercent}%`);
        }
      }, index * 1000); // 2 seconds delay per character
    });
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacters((prevSelected) => {
      if (prevSelected.includes(character)) {
        return prevSelected.filter((item) => item !== character);
      } else {
        return [...prevSelected, character];
      }
    });
  };

  const handleLabelClick = (label) => {
    if (selectedCharacters.length > 0) {
      // Update the label of the selected characters
      const updatedPassword = password.map((item) =>
        selectedCharacters.includes(item)
          ? { ...item, label, bgColor: getColorByLabel(label) }
          : item
      );

      // Update label counts
      const newLabelCounts = { ...labelCounts };
      selectedCharacters.forEach((item) => {
        if (item.label) {
          newLabelCounts[item.label]--;
        }
        newLabelCounts[label]++;
      });

      setPassword(updatedPassword);
      setLabelCounts(newLabelCounts);
      setSelectedCharacters([]); // Clear the selection
    }
  };

  const getColorByLabel = (label) => {
    switch (label) {
      case "Character 1":
        return "bg-red-400/50";
      case "Character 2":
        return "bg-green-400/50";
      case "Character 3":
        return "bg-orange-400/50";
      case "Character 4":
        return "bg-blue-400/50";
      case "Character 5":
        return "bg-purple-400/50";
      case "Character 6":
        return "bg-yellow-400/50";
      default:
        return "";
    }
  };

  const [epochValue, setEpochValue] = useState(2);

  const handleEpochChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpochValue(Number(event.target.value));
  };

  const [learningRate, setLearningRate] = useState(0.01);

  const handleLearningRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLearningRate(Number(event.target.value));
  };

  return (
    <div
      className="max-w-5xl mx-auto w-full h-[70vh] mt-20 bg-cyan-400/50 absolute inset-0 z-50 flex 
      flex-col items-start justify-start rounded-xl border-2 pt-2 pl-4 pr-2"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <IoMdCloseCircleOutline
        className="text-4xl text-red-500 absolute top-1 right-1 cursor-pointer"
        onClick={handleClose}
      />
      <div className="w-full border-b -ml-2">
        <p className="text-2xl font-semibold text-slate-600">
          Train AI Computer
        </p>
      </div>
      <div className="w-full grid grid-cols-6 mt-4 h-full pb-4 gap-x-2">
        <div className="col-span-4 border-2 rounded-xl bg-white/50">
          <div className="w-full bg-white -mt-0.5 rounded-t-lg p-2 pl-3 flex justify-between">
            <p className="text-slate-500 font-semibold text-xl tracking-wide">
              OCR (Optical Character Recognition)
            </p>
            {/* <p
              className="text-cyan-600 tracking-wide my-auto underline underline-offset-2 cursor-pointer"
              onClick={handleReRandomize}
            >
              Regenerate
            </p> */}
          </div>
          <div className="w-full grid grid-cols-6 gap-2 mt-3 pl-4 pr-2">
            <div className="col-span-4 px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <p className="text-lg text-slate-500 font-semibold">
                Training Data Size
              </p>
              <input
                className="w-full accent-cyan-400"
                type="range"
                id="trainSlider"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="col-span-2 px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <p className="text-lg text-slate-500 font-semibold">
                Data Quality
              </p>
              <div className="flex gap-x-2 -mt-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    id="noiseCheckbox"
                    style={{ cursor: "pointer" }}
                  />
                  <span className="ml-2 text-slate-500">Noise</span>
                </label>
                <label className="flex items-center my-auto">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    id="distortionCheckbox"
                    style={{ cursor: "pointer" }}
                  />
                  <span className="ml-2 text-slate-500">Distortion</span>
                </label>
              </div>
            </div>
            <div className="col-span-3 px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <p className="text-lg text-slate-500 font-semibold">Model Type</p>
              <select
                className="w-full accent-cyan-400 bg-white border border-slate-400 rounded-lg px-2 py-1"
                id="modelTypeSelect"
                style={{ cursor: "pointer" }}
              >
                <option value="model1">Neural Networks</option>
                <option value="model2">Decision Trees</option>
              </select>
            </div>
            <div className="col-span-3 px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <p className="text-lg text-slate-500 font-semibold">Model</p>
              <select
                className="w-full accent-cyan-400 bg-white border border-slate-400 rounded-lg px-2 py-1"
                id="modelTypeSelect"
                style={{ cursor: "pointer" }}
              >
                <option value="model1">
                  Convolutional Neural Networks (CNNs)
                </option>
                <option value="model2">Recurrent Neural Networks (RNNs)</option>
                <option value="model2">Random Forests</option>
              </select>
            </div>
            <div className="col-span-full px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <p className="text-lg text-slate-500 font-semibold">Data</p>
              <div
                className="pl-3 pr-1.5 py-2 bg-red-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 1")}
              >
                <div className="">
                  <p className="font-semibold text-red-800">Character 1</p>
                </div>
                <p className="font-semibold text-red-800 text-lg my-auto mr-2">
                  {labelCounts["Character 1"]}
                </p>
              </div>
              <div
                className="pl-3 pr-1.5 py-2 bg-green-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 2")}
              >
                <div className="">
                  <p className="font-semibold text-green-800">Character 2</p>
                </div>
                <p className="font-semibold text-green-800 text-lg my-auto mr-2">
                  {labelCounts["Character 2"]}
                </p>
              </div>
              <div
                className="pl-3 pr-1.5 py-2 bg-orange-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 3")}
              >
                <div className="">
                  <p className="font-semibold text-orange-800">Character 3</p>
                </div>
                <p className="font-semibold text-orange-800 text-lg my-auto mr-2">
                  {labelCounts["Character 3"]}
                </p>
              </div>
              <div
                className="pl-3 pr-1.5 py-2 bg-blue-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 4")}
              >
                <div className="">
                  <p className="font-semibold text-blue-800">Character 4</p>
                </div>
                <p className="font-semibold text-blue-800 text-lg my-auto mr-2">
                  {labelCounts["Character 4"]}
                </p>
              </div>
              <div
                className="pl-3 pr-1.5 py-2 bg-purple-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 5")}
              >
                <div className="">
                  <p className="font-semibold text-purple-800">Character 5</p>
                </div>
                <p className="font-semibold text-purple-800 text-lg my-auto mr-2">
                  {labelCounts["Character 5"]}
                </p>
              </div>
              <div
                className="pl-3 pr-1.5 py-2 bg-yellow-400/50 border rounded-lg cursor-pointer flex justify-between my-1"
                onClick={() => handleLabelClick("Character 6")}
              >
                <div className="">
                  <p className="font-semibold text-yellow-800">Character 6</p>
                </div>
                <p className="font-semibold text-yellow-800 text-lg my-auto mr-2">
                  {labelCounts["Character 6"]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 border-2 rounded-xl bg-white/50 flex flex-col">
          <p className="text-slate-500 text-xl font-semibold text-center mx-auto mt-2.5 tracking-wide flex">
            <GrDocumentConfig className="text-2xl mr-2" />
            <span>Configuration</span>
          </p>
          <div className="mt-2 flex flex-col gap-y-2 px-2">
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
                Epoch is the number of times the model will be trained on the
                entire training dataset. The more epochs, the more the model
                will learn from the data.
              </p>
            </div>
            <div className="px-2 py-1 bg-cyan-100 border border-slate-400 rounded-lg">
              <div className="flex w-full justify-between">
                <p className="text-lg text-slate-500 font-semibold my-auto">
                  Learning Rate
                </p>
                <p className="text-sm px-1 text-slate-500 my-auto">
                  Current: {learningRate}
                </p>
              </div>
              <input
                className="w-full accent-cyan-400"
                type="range"
                id="learningRateStepper"
                min="0.01"
                max="0.1"
                step="0.01"
                list="learningRateValues"
                value={learningRate}
                onChange={handleLearningRateChange}
                style={{ cursor: "pointer" }}
              />
              <datalist id="learningRateValues">
                <option value="0.01" label="0.01"></option>
                <option value="0.02" label="0.02"></option>
                <option value="0.03" label="0.03"></option>
                <option value="0.04" label="0.04"></option>
                <option value="0.05" label="0.05"></option>
                <option value="0.06" label="0.06"></option>
                <option value="0.07" label="0.07"></option>
                <option value="0.08" label="0.08"></option>
                <option value="0.09" label="0.09"></option>
                <option value="0.1" label="0.1"></option>
              </datalist>
              <p className="text-sm px-1 text-slate-400 mt-1">
                Learning rate determines how quickly or slowly a model learns. A
                smaller learning rate means the model learns more slowly but can
                achieve better accuracy.
              </p>
            </div>
          </div>
          <button
            onClick={handleActivateAI}
            className="mt-auto text-xl w-[95%] mx-auto mb-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg"
          >
            Start Training
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainOcrComputerUI;
