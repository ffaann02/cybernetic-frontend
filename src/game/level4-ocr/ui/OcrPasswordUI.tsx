import { ProgressSpinner } from "primereact/progressspinner";
import { useContext, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { GameContext } from "../../../contexts/GameContext";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import { IoMdCloseCircleOutline } from "react-icons/io";

const OcrPasswordUI = () => {
  const [numCodes, setNumCodes] = useState(6); // Number of secret codes
  const [password, setPassword] = useState(generateRandomPassword(numCodes));
  const [predictions, setPredictions] = useState(Array(numCodes).fill(null));
  const [accuracy, setAccuracy] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const { setIsInteracting, setCurrentHit } = useContext(GameContext);
  const { isOpenOcrPassword, setIsOpenOcrPassword } = useLevel4Context();

  const handleClose = () => {
    setIsOpenOcrPassword(false);
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

  return (
    <div
      className="max-w-4xl mx-auto w-full h-[50vh] mt-20 bg-cyan-400/50 absolute inset-0 z-50 flex 
      flex-col items-start justify-start rounded-xl border-2 pt-2 pl-4 pr-2"
      style={{ backdropFilter: "blur(4px)" }}
    >
        <IoMdCloseCircleOutline className="text-4xl text-red-500 absolute top-1 right-1 cursor-pointer" onClick={handleClose} />
      <div className="w-full border-b -ml-2">
        <p className="text-2xl font-semibold text-slate-600">
          Secret Code Access
        </p>
      </div>
      <div className="w-full grid grid-cols-6 mt-4 h-full pb-4 gap-x-2">
        <div className="col-span-4 border-2 rounded-xl">
          <div className="w-full bg-white -mt-0.5 rounded-t-lg p-2 pl-3">
            <p className="text-slate-500 font-semibold text-xl tracking-wide">
              Password
            </p>
          </div>
          <p className="ml-3 mt-4 text-slate-600">
            {"> Select your OCR model to unlock password."}
          </p>
          <p className="ml-3 text-slate-600">
            {"> Only accept above 50% accuracy"}
          </p>
          <div className="w-full grid grid-cols-6 gap-2 mt-4 pl-4 pr-2">
            {password.map((item, index) => (
              <div
                key={index}
                className={`col-span-1 h-20 mx-auto flex p-2 border-2 w-fit rounded-lg
                    transition-all duration-200 ease-in-out
                    ${
                      predictions[index] === null
                        ? "border-gray-500"
                        : predictions[index] === item.character
                        ? "border-green-500 bg-green-400/50"
                        : "border-red-500 bg-red-400/50"
                    } bg-black/40`}
              >
                <img
                  src={`/images/ocr/Pattern${item.pattern}/${item.character}.png`}
                  className="bg-white/50 rounded-md mx-auto"
                />
              </div>
            ))}
          </div>
          {/* <button
            onClick={handleReRandomize}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Re-randomize Password
          </button> */}
        </div>
        <div className="col-span-2 border-2 rounded-xl bg-white/50 flex flex-col">
          <p className="text-slate-500 text-xl font-semibold text-center mx-auto mt-2.5 tracking-wide flex">
            <GrDocumentConfig className="text-2xl mr-2" />
            <span>AI Configuration</span>
          </p>
          <p className="ml-2 mt-2 font-semibold text-slate-500">
            Selected Model
          </p>
          <select className="border-2 rounded-lg p-1 w-[95%] mx-auto text-slate-500">
            <option value="model1">Model 1</option>
            <option value="model2">Model 2</option>
            <option value="model3">Model 3</option>
          </select>
          <p className="ml-2 mt-3 font-semibold text-slate-500">Result</p>
          <div className="bg-cyan-400/50 w-[95%] border px-2 pt-3 pb-2 mx-auto rounded-lg flex flex-col">
            {!isPredicting && accuracy === null && (
              <p className="-mt-1 text-center">-</p>
            )}
            {isPredicting ? (
              <>
                <ProgressSpinner className="mx-auto" />
                <p className="text-center text-slate-500 mt-1">Processing</p>
              </>
            ) : (
              accuracy !== null && (
                <>
                  <p className="text-left text-slate-500 -mt-1 ml-1">
                    Accuracy: {accuracy}%
                  </p>
                  <p className="text-left text-slate-500 mt-1 ml-1">
                    Accept: {accuracy >= 50 ? "Yes" : "No"}
                  </p>
                </>
              )
            )}
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

export default OcrPasswordUI;
