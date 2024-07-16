import { useContext, useEffect, useState } from "react";
import { LiaRobotSolid } from "react-icons/lia";
import { MdCategory } from "react-icons/md";
import { BsClipboardData, BsGraphUp } from "react-icons/bs";
import { PiBrain, PiEggCrack, PiEye } from "react-icons/pi";
import { Carousel } from "primereact/carousel";
import { Steps } from "primereact/steps";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { GameContext } from "../../../../contexts/GameContext";
import DataStoragePanel from "./DataStoragePanel";
import initData from "./data/fakeInitEnemyData.json";
import classificationModelList from "./data/classificationModelList.json";
import AiClassification from "./AiClassification";

const TrainAiComputer = () => {
  const { dataStorage, setDataStorage } = useContext(GameContext);

  const sections = [
    { title: "Data Storage" },
    { title: "Train AI Model" },
    { title: "Tools" },
    { title: "Level Info" },
  ];

  const dataType = [
    { title: "Enemy" },
    { title: "Object" },
    { title: "Image" },
    { title: "Text" },
    { title: "Audio" },
  ];

  const [currentSection, setCurrentSection] = useState(sections[0]);
  const aiTypes = [
    {
      Icon: MdCategory,
      title: "ML Classification",
      key: "ml-classification",
      description:
        "A classification algorithm is used to predict the category of a new instance.",
    },
    {
      Icon: BsGraphUp,
      title: "Linear Regression",
      key: "linear-regression",
      description:
        "A linear regression algorithm is used to predict the relationship between two properties.",
    },
    {
      Icon: PiEggCrack,
      title: "Genetic Algorithm",
      key: "genetic-algorithm",
      description:
        "A genetic algorithm is used to find the optimal solution to a problem.",
    },
    {
      Icon: PiBrain,
      title: "Neural Network",
      key: "neural-network",
      description:
        "A neural network is used to simulate the human brain to solve complex problems.",
    },
    {
      Icon: PiEye,
      title: "OCR",
      key: "ocr",
      description:
        "Optical Character Recognition (OCR) is used to recognize text in images.",
    },
  ];

  const [selectedAIfield, setSelectedAIfield] = useState<any>(null);
  const aiTypeCardTemplate = (model: any) => {
    const { Icon } = model;
    return (
      <div
        onClick={() => {
          setSelectedAIfield(model.key);
        }}
        className="border flex flex-col text-center pt-6 pb-4 rounded-xl bg-white/20 
                  hover:bg-cyan-600/40 cursor-pointer transition-all ease-linear duration-100 mx-2"
      >
        <Icon className="text-[8rem] text-blue-600 mx-auto" />
        <h3 className="mt-3 text-2xl text-white">{model.title}</h3>
        <p className="px-4 text-white">{model.description}</p>
      </div>
    );
  };

  useEffect(() => {
    if (initData) {
      setDataStorage(initData);
    }
  }, []);

  const groupAndCountData = (data) => {
    return data.reduce((acc, item) => {
      const key = `${item.element}-${item.name}`;
      if (!acc[key]) {
        acc[key] = { ...item, count: 1 };
      } else {
        acc[key].count += 1;
      }
      return acc;
    }, {});
  };

  const [currentDataType, setCurrentDataType] = useState("Enemy");

  const handleNext = () => {
    console.log("next");
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prevIndex) => prevIndex - 1);
    } else {
      setActiveIndex(0);
      setSelectedAIfield(null);
    }
  };

  const classificationMenuItemsStep = [
    {
      id: "0",
      index: 0,
      label: "Problem",
    },
    {
      id: "1",
      index: 1,
      label: "Data",
    },
    {
      id: "2",
      index: 2,
      label: "Model",
    },
    {
      id: "3",
      index: 3,
      label: "Train",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedData, setSelectedData] = useState<any>([]);

  const [isTraining, setIsTraining] = useState(false);

  return (
    <div className="absolute w-full z-[10000] flex h-full top-0 p-16 pt-10 left-1/2 transform -translate-x-1/2">
      <div
        className="flex-grow overflow-hidden h-[90vh] relative bg-cyan-400/10 border-8 border-cyan-400/20 rounded-xl pt-0 pb-8 shadow-lg shadow-white"
        id="ui-computer-panel"
      >
        <div
          className="sticky w-full top-0 px-20 pb-4 bg-cyan-400/10"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div
            className="text-center flex text-3xl rounded-b-2xl border-8 border-t-0 border-cyan-400/40 mb-6 pt-5 pb-4 
            px-6  w-fit mx-auto bg-cyan-600/10 text-white font-semibold tracking-wider"
          >
            Intelligence Computer
          </div>
          <div className="flex gap-x-6 h-fit">
            {sections.map((section) => (
              <button
                key={section.title}
                className={`px-6 py-4 text-xl border rounded-lg ${
                  currentSection.title === section.title
                    ? "bg-cyan-400/20 hover: text-white font-semibold"
                    : "text-slate-200 bg-white/20 "
                }
                    hover:bg-cyan-400/20 transition-all duration-200 ease-linear hover:shadow-md hover:shadow-blue-400`}
                onClick={() => {
                  setCurrentSection(section);
                }}
              >
                <div className="flex gap-x-2">
                  <LiaRobotSolid className="my-auto text-2xl" />{" "}
                  <p>{section.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {currentSection.title === "Data Storage" && (
          <DataStoragePanel
            dataStorage={dataStorage}
            setDataStorage={setDataStorage}
            dataType={dataType}
            currentDataType={currentDataType}
            setCurrentDataType={setCurrentDataType}
            groupAndCountData={groupAndCountData}
          />
        )}
        {currentSection.title === "Train AI Model" &&
          selectedAIfield === null && (
            <div className="w-full h-full px-20 pt-10">
              <div className="border-2 rounded-2xl pb-10 bg-black/50 relative">
                <div className="text-center text-3xl text-white py-6 font-bold tracking-wider">
                  Select AI Type
                </div>
                <div className="mt-4">
                  <Carousel
                    value={aiTypes}
                    numScroll={1}
                    numVisible={3}
                    itemTemplate={aiTypeCardTemplate}
                  />
                </div>
              </div>
            </div>
          )}
        {currentSection.title === "Train AI Model" && (
          <>
            {selectedAIfield === "ml-classification" && (
              <AiClassification
                aiTypes={aiTypes}
                selectedAIfield={selectedAIfield}
                classificationMenuItemsStep={classificationMenuItemsStep}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                isTraining={isTraining}
                setIsTraining={setIsTraining}
                dataStorage={dataStorage}
                setDataStorage={setDataStorage} // Assuming this should be a function to update dataStorage
                groupAndCountData={groupAndCountData}
                classificationModelList={classificationModelList}
                dataType={dataType}
                currentDataType={currentDataType}
                setCurrentDataType={setCurrentDataType}
                handleBack={handleBack}
                handleNext={handleNext}
              />
            )}
            {selectedAIfield === "linear-regression" && (
              // Render your component for linear regression here
              <div>linear regression</div>
              // Props for LinearRegressionComponent
            )}
            {selectedAIfield === "genetic-algorithm" && (
              // Render your component for genetic algorithm here
              <div>genetic algorithm</div>
              // Props for GeneticAlgorithmComponent
            )}
            {selectedAIfield === "neural-network" && (
              // Render your component for neural network here
              <div>neural network</div>
              // Props for NeuralNetworkComponent
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainAiComputer;
