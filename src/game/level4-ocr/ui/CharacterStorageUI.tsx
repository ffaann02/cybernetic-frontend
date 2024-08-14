import { ProgressSpinner } from "primereact/progressspinner";
import { useContext, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { GameContext } from "../../../contexts/GameContext";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import { IoMdCloseCircleOutline } from "react-icons/io";

const CharacterStorageUI = () => {
  const [numCodes, setNumCodes] = useState(18); // Number of secret codes
  const [password, setPassword] = useState(generateRandomPassword(numCodes));
  const [predictions, setPredictions] = useState(Array(numCodes).fill(null));
  const [accuracy, setAccuracy] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [labelCounts, setLabelCounts] = useState({
    "Character 1": 0,
    "Character 2": 0,
    "Character 3": 0,
    "Character 4": 0,
    "Character 5": 0,
    "Character 6": 0,
  });
  const { setIsInteracting, setCurrentHit } = useContext(GameContext);
  const { isOpenOcrPassword, setIsOpenOcrPassword, setIsOpenCharacterStorage } =
    useLevel4Context();

  const handleClose = () => {
    setIsOpenCharacterStorage(false);
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
        <p className="text-2xl font-semibold text-slate-600">Secret Code</p>
      </div>
      <div className="w-full grid grid-cols-6 mt-4 h-full pb-4 gap-x-2">
        <div className="col-span-4 border-2 rounded-xl bg-white/50">
          <div className="w-full bg-white -mt-0.5 rounded-t-lg p-2 pl-3 flex justify-between">
            <p className="text-slate-500 font-semibold text-xl tracking-wide">
              Randomly Character
            </p>
            <p
              className="text-cyan-600 tracking-wide my-auto underline underline-offset-2 cursor-pointer"
              onClick={handleReRandomize}
            >
              Regenerate
            </p>
          </div>
          <div className="w-full grid grid-cols-6 gap-2 mt-4 pl-4 pr-2">
            {password.map((item, index) => (
              <img
                key={index}
                src={`/images/ocr/Pattern${item.pattern}/${item.character}.png`}
                className={`rounded-md mx-auto cursor-pointer ${
                  selectedCharacters.includes(item)
                    ? "border-2 border-blue-500"
                    : ""
                } ${item.bgColor || "bg-white/50"}`}
                onClick={() => handleCharacterClick(item)}
              />
            ))}
          </div>
        </div>
        <div className="col-span-2 border-2 rounded-xl bg-white/50 flex flex-col">
          <p className="text-slate-500 text-xl font-semibold text-center mx-auto mt-2.5 tracking-wide flex">
            <GrDocumentConfig className="text-2xl mr-2" />
            <span>Data Label</span>
          </p>
          <p className="ml-2 mt-2 font-semibold text-slate-500">Class</p>
          <div className="mt-2 flex flex-col gap-y-2 px-2">
            <div
              className="pl-3 pr-1.5 py-2 bg-red-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 1")}
            >
              <div className="">
                <p className="font-semibold text-red-800">Character 1</p>
                <p className="font-semibold text-red-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 1"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
            <div
              className="pl-3 pr-1.5 py-2 bg-green-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 2")}
            >
              <div className="">
                <p className="font-semibold text-green-800">Character 2</p>
                <p className="font-semibold text-green-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 2"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
            <div
              className="pl-3 pr-1.5 py-2 bg-orange-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 3")}
            >
              <div className="">
                <p className="font-semibold text-orange-800">Character 3</p>
                <p className="font-semibold text-orange-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 3"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
            <div
              className="pl-3 pr-1.5 py-2 bg-blue-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 4")}
            >
              <div className="">
                <p className="font-semibold text-blue-800">Character 4</p>
                <p className="font-semibold text-blue-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 4"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
            <div
              className="pl-3 pr-1.5 py-2 bg-purple-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 5")}
            >
              <div className="">
                <p className="font-semibold text-purple-800">Character 5</p>
                <p className="font-semibold text-purple-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 5"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
            <div
              className="pl-3 pr-1.5 py-2 bg-yellow-400/50 border rounded-lg cursor-pointer flex justify-between"
              onClick={() => handleLabelClick("Character 6")}
            >
              <div className="">
                <p className="font-semibold text-yellow-800">Character 6</p>
                <p className="font-semibold text-yellow-800 text-sm -mt-1">
                  Labelled: {labelCounts["Character 6"]}
                </p>
              </div>
              <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                Select
              </button>
            </div>
          </div>
          <button
            onClick={handleActivateAI}
            className="mt-auto w-[95%] mx-auto mb-2 px-4 py-2 bg-cyan-500 text-white rounded-lg"
          >
            Activate AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterStorageUI;
