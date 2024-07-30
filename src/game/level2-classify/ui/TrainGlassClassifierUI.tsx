import { Steps } from "primereact/steps";
import { useContext, useState } from "react";
import { GrDatabase } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import { GameContext } from "../../../contexts/GameContext";
import { FiTarget } from "react-icons/fi";
import { FaRegObjectGroup } from "react-icons/fa";
import { Checkbox } from "primereact/checkbox";

const TrainGlassClassifierUI = ({
  isOpenTrainComputer,
  setIsOpenTrainComputer,
  glassParameters,
  setGlassParameters,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);
  const [selectedGlasses, setSelectedGlasses] = useState<number[]>([]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );

  const algorithms = [
    "Decision Tree",
    "Random Forest",
    "Support Vector Machine",
    "K-Nearest Neighbors",
    "Logistic Regression",
  ];

  const handleSelectAlgorithm = (algorithm: string) => {
    setSelectedAlgorithm((prevSelected) =>
      prevSelected === algorithm ? null : algorithm
    );
  };

  const getAlgorithmExplanation = (algorithm: string) => {
    switch (algorithm) {
      case "Decision Tree":
        return "A tree-like model of decisions. It's simple to understand and interpret, but can create complex trees that may not generalize well.";
      case "Random Forest":
        return "An ensemble of decision trees. It's robust and usually avoids overfitting, but can be computationally intensive and hard to interpret.";
      case "Support Vector Machine":
        return "Finds a hyperplane that best divides the classes. Effective in high-dimensional spaces, but may struggle with large datasets.";
      case "K-Nearest Neighbors":
        return "Classifies based on the majority class of K nearest neighbors. Simple and effective, but can be slow with large datasets.";
      case "Logistic Regression":
        return "Models the probability of an instance belonging to a particular class. Works well for linearly separable classes, but may underperform with complex relationships.";
      default:
        return "No explanation available.";
    }
  };

  const items = [
    { label: "Data", step: 0 },
    { label: "Feature and Parameters", step: 1 },
    { label: "Model", step: 2 },
    { label: "Train", step: 3 },
  ];

  const parameters = [
    "thickness",
    "transparency",
    "density",
    "weight",
    "defect",
  ];

  const handleSelectParameter = (parameter: string) => {
    setSelectedParameters((prev) =>
      prev.includes(parameter)
        ? prev.filter((p) => p !== parameter)
        : [...prev, parameter]
    );
  };

  const handleClose = () => {
    setIsOpenTrainComputer(false);
    setIsInteracting(false);
    setCurrentHit("");
  };

  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);

  const handleSelectGlass = (index: number) => {
    setSelectedGlasses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const countSelectedGlasses = (type: "dangerous" | "safe") => {
    return selectedGlasses.filter(
      (index) => glassParameters[index]?.breakable === (type === "dangerous")
    ).length;
  };

  return (
    <div className="w-full h-screen bg-black/65 absolute z-[10000] flex items-center justify-center">
      <div className="absolute min-h-[80vh] w-full max-w-4xl h-1/2 mb-10 rounded-2xl border-2 bg-cyan-400/50 overflow-y-hidden">
        <button
          className="text-white bg-red-400/50 absolute right-2 top-2 z-[120] border-red-600 
            border px-2 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 ease-linear"
          onClick={handleClose}
        >
          <RxCrossCircled className="text-2xl my-auto" />
        </button>
        <div className="sticky top-0 bg-cyan-600 pt-3 border-b">
          <p className="text-center text-white text-2xl">
            This is the Computer for training Glass classifier.
          </p>
          <Steps
            activeIndex={activeIndex}
            model={items}
            readOnly={false}
            onSelect={(e) => setActiveIndex(e.index)}
          />
        </div>
        {activeIndex === 0 && (
          <div className="w-full h-full pl-4 pr-2 pt-4">
            <div className="w-full h-full bg-white/50 rounded-lg border grid grid-cols-6 p-2">
              <div className="col-span-4 flex flex-col gap-y-2 overflow-y-auto pr-2 pb-14">
                {glassParameters.length === 0 ? (
                  <p className="text-center text-3xl text-slate-600 m-auto pb-20">
                    No collected data available.
                  </p>
                ) : (
                  glassParameters.map((glass, index) => (
                    <div
                      key={index}
                      className={`w-full flex justify-between bg-cyan-400/50 rounded-lg border px-1 py-1 hover:bg-cyan-500/50 cursor-pointer ${
                        selectedGlasses.includes(index) ? "opacity-90" : ""
                      }`}
                      onClick={() => handleSelectGlass(index)}
                    >
                      <div className="flex">
                        <div className="w-[40px] h-[40px] my-auto relative">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/896/896123.png"
                            className="mx-auto"
                          />
                          <div
                            className={`w-full h-full absolute ${
                              glass.breakable ? "bg-red-400" : "bg-green-400"
                            }
            z-50 top-0 rounded-lg left-0.5 opacity-40 border border-blue-500`}
                          ></div>
                        </div>
                        <div className="ml-2">
                          <p className="font-semibold text-lg text-slate-600">
                            {glass.name.charAt(0).toUpperCase() +
                              glass.name.slice(1)}
                          </p>
                          <p className="font-semibold text-sm text-white -mt-1">
                            Type: {glass.breakable ? "Dangerous" : "Safe"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`border-2 px-2 h-fit py-1 rounded-xl flex my-auto mr-1 ${
                          selectedGlasses.includes(index) ? "bg-red-400" : ""
                        }`}
                      >
                        <span className="text-xl font-bold text-white my-auto ml-0.5">
                          {selectedGlasses.includes(index)
                            ? "Remove"
                            : "Select"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-y-2 px-2.5">
                <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                  <GrDatabase className="text-lg my-auto" />
                  <span className="my-auto ml-2 pt-0.5">Selected Glass</span>
                </p>
                <div className="w-full px-2 py-2 flex bg-cyan-400/50 border rounded-lg">
                  <p
                    className="my-auto font-semibold text-slate-500 ml-2 text-xl w-full 
                flex justify-between pr-2"
                  >
                    <span>Dangerous: </span>
                    <span>{countSelectedGlasses("dangerous")}</span>
                  </p>
                </div>
                <div className="w-full px-2 py-2 flex bg-cyan-400/50 border rounded-lg">
                  <p
                    className="my-auto font-semibold text-slate-500 ml-2 text-xl w-full 
                flex justify-between pr-2"
                  >
                    <span>Safe: </span>
                    <span>{countSelectedGlasses("safe")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div className="w-full h-full pl-4 pr-2 pt-4">
            <div className="w-full h-full bg-white/50 rounded-lg border grid grid-cols-6 p-2">
              <div className="col-span-3 flex flex-col gap-y-2 overflow-y-auto pr-2 pb-14">
                <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                  <FaRegObjectGroup className="text-lg my-auto" />
                  <span className="my-auto ml-2 pt-0.5">
                    Feature Parameteres
                  </span>
                </p>
                <div className="bg-cyan-400/50 p-4 border rounded-xl flex flex-col gap-y-4">
                  {parameters.map((param) => (
                    <div key={param} className="flex items-center">
                      <Checkbox
                        type="checkbox"
                        id={param}
                        checked={selectedParameters.includes(param)}
                        onChange={() => handleSelectParameter(param)}
                      />
                      <label
                        htmlFor={param}
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize"
                      >
                        {param}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-y-2 px-2.5">
                <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                  <FiTarget className="text-lg my-auto" />
                  <span className="my-auto ml-2 pt-0.5">
                    Target Value (Predict)
                  </span>
                </p>
                <div className="w-full px-2 py-2 flex flex-col bg-cyan-400/50 border rounded-lg text-center">
                  <p className="my-auto font-semibold text-slate-500 ml-2 text-xl w-full pr-2 mx-auto">
                    <span>Glass Type</span>
                  </p>
                  <p href="#" className="relative text-left p-2 text-slate-500">
                    <span className="text-lg text-left">
                      In this AI classification UI, the "Glass Type" is the
                      target because it helps the model learn and classify
                      different properties of glass based on provided data.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeIndex === 2 && (
          <div className="w-full h-full pl-4 pr-2 pt-4">
            <div className="w-full h-full bg-white/50 rounded-lg border grid grid-cols-6 p-2">
              <div className="col-span-3 flex flex-col gap-y-2 overflow-y-auto pr-2 pb-14">
                <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                  <FaRegObjectGroup className="text-lg my-auto" />
                  <span className="my-auto ml-2 pt-0.5">
                    ML Classification Algorithms
                  </span>
                </p>
                <div className="bg-cyan-400/50 p-2 border rounded-xl flex flex-col gap-y-2">
                  {algorithms.map((algorithm) => (
                    <div
                      key={algorithm}
                      className={`w-full py-2 flex justify-between bg-cyan-400/50 rounded-lg border px-1 py-1 hover:bg-cyan-500/50 cursor-pointer ${
                        selectedAlgorithm === algorithm ? "opacity-90" : ""
                      }`}
                      onClick={() => handleSelectAlgorithm(algorithm)}
                    >
                      <div className="flex">
                        <div className="w-[40px] h-[40px] my-auto relative">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                            className="mx-auto w-full h-full"
                            alt="Algorithm icon"
                          />
                        </div>
                        <div className="ml-2 my-auto">
                          <p className="font-semibold text-lg text-slate-600">
                            {algorithm}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`border-2 px-2 h-fit py-1 rounded-xl flex my-auto mr-1 ${
                          selectedAlgorithm === algorithm ? "bg-red-400" : ""
                        }`}
                      >
                        <span className="text-xl font-bold text-white my-auto ml-0.5">
                          {selectedAlgorithm === algorithm
                            ? "Remove"
                            : "Select"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-y-2 px-2.5">
                <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                  <FiTarget className="text-lg my-auto" />
                  <span className="my-auto ml-2 pt-0.5">
                    Algorithm Explanation
                  </span>
                </p>
                <div className="w-full px-2 py-2 flex flex-col bg-cyan-400/50 border rounded-lg overflow-y-auto max-h-[400px]">
                  {selectedAlgorithm ? (
                    <div>
                      <p className="font-semibold text-slate-700 text-lg">
                        {selectedAlgorithm}
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        {getAlgorithmExplanation(selectedAlgorithm)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-slate-600">
                      Select an algorithm to see its explanation.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainGlassClassifierUI;
