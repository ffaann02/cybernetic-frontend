import { useContext, useEffect, useState } from "react";
import { LiaRobotSolid } from "react-icons/lia";
import { MdCancel, MdCategory } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { PiBrain, PiEggCrack, PiEye } from "react-icons/pi";
import { Carousel } from "primereact/carousel";
import { GameContext } from "../../../../contexts/GameContext";
import DataStoragePanel from "./DataStoragePanel";
import enemyData from "./data/fakeInitEnemyData.json";
import objectData from "./data/fakeInitObjectData.json";
import classificationModelList from "./data/classificationModelList.json";
import AiClassification from "./AiClassification";
import { FiDatabase, FiTool, FiInfo } from "react-icons/fi";
import Tools from "./Tools";
import AiLinearRegression from "./AiLinearRegression";
import AiGeneticAlgorithm from "./AiGeneticAlgorithm";
import AiNeuralNetwork from "./AiNeuralNetwork";

const TrainAiComputer = () => {
  const { dataStorage, setDataStorage, setIsCoding, setIsInteracting, setCurrentHit} = useContext(GameContext);

  const sections = [
    { title: "Data Storage", Icon: FiDatabase },
    { title: "Train AI Model", Icon: LiaRobotSolid },
    { title: "Tools", Icon: FiTool },
    { title: "Level Info", Icon: FiInfo },
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
    // Assuming setDataStorage is a function that updates a state variable
    // and that objectData is an array and enemyData is an object you want to store together.
    const objectDataWithIndex = objectData.map((item, index) => ({
      ...item,
      index, // Add the index to each object in objectData
    }));

    const combinedData = {
      objectData: objectDataWithIndex, // Use the modified objectData with index
      enemyData: enemyData, // This will only be added if enemyData is not falsy
    };

    console.log(combinedData);

    if (enemyData) {
      setDataStorage(combinedData);
    }
  }, [objectData, enemyData]); // Adding objectData and enemyData as dependencies

  const groupAndCountData = (data: any) => {
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

  const menuItemsStep = [
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
        className="flex-grow overflow-y-hidden h-[90vh] relative bg-cyan-400/10 border-8 border-cyan-400/20 rounded-xl pt-0 pb-8 shadow-lg shadow-white"
        id="ui-computer-panel"
      >
        <div className="absolute right-2 top-2 z-50">
          <button
            className="px-3 py-2 rounded-lg bg-red-500/50 hover:bg-red-500/70 flex gap-x-2 items-center"
            onClick={() => {
              setIsCoding(false);
              setIsInteracting(false);
              setCurrentHit("");
            }}
          >
            <MdCancel className="textes-white text-2xl"/>
            <span className="text-white">Close</span>
          </button>
        </div>
        <div
          className="sticky w-full top-0 px-20 pb-4 bg-black/50 z-20"
          style={{ backdropFilter: "blur(20px)" }}
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
                  <section.Icon className="my-auto text-2xl" />
                  <p>{section.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="h-full overflow-hidden">
          {currentSection.title === "Data Storage" && (
            <DataStoragePanel
              dataStorage={dataStorage}
              setDataStorage={setDataStorage}
              dataType={dataType}
              currentDataType={currentDataType}
              setCurrentDataType={setCurrentDataType}
              groupAndCountData={groupAndCountData}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
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
            <div className="h-full">
              <>
                {selectedAIfield === "ml-classification" && (
                  <AiClassification
                    aiTypes={aiTypes}
                    selectedAIfield={selectedAIfield}
                    menuItemsStep={menuItemsStep}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    isTraining={isTraining}
                    setIsTraining={setIsTraining}
                    dataStorage={dataStorage}
                    setDataStorage={setDataStorage}
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
                  <AiLinearRegression
                    aiTypes={aiTypes}
                    selectedAIfield={selectedAIfield}
                    menuItemsStep={menuItemsStep}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    isTraining={isTraining}
                    setIsTraining={setIsTraining}
                    dataStorage={dataStorage}
                    setDataStorage={setDataStorage}
                    groupAndCountData={groupAndCountData}
                    classificationModelList={classificationModelList}
                    dataType={dataType}
                    currentDataType={currentDataType}
                    setCurrentDataType={setCurrentDataType}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                  // Props for LinearRegressionComponent
                )}
                {selectedAIfield === "genetic-algorithm" && (
                  <AiLinearRegression
                    aiTypes={aiTypes}
                    selectedAIfield={selectedAIfield}
                    menuItemsStep={menuItemsStep}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    isTraining={isTraining}
                    setIsTraining={setIsTraining}
                    dataStorage={dataStorage}
                    setDataStorage={setDataStorage}
                    groupAndCountData={groupAndCountData}
                    classificationModelList={classificationModelList}
                    dataType={dataType}
                    currentDataType={currentDataType}
                    setCurrentDataType={setCurrentDataType}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                )}
                {selectedAIfield === "neural-network" && (
                  <AiNeuralNetwork
                    aiTypes={aiTypes}
                    selectedAIfield={selectedAIfield}
                    menuItemsStep={menuItemsStep}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    isTraining={isTraining}
                    setIsTraining={setIsTraining}
                    dataStorage={dataStorage}
                    setDataStorage={setDataStorage}
                    groupAndCountData={groupAndCountData}
                    classificationModelList={classificationModelList}
                    dataType={dataType}
                    currentDataType={currentDataType}
                    setCurrentDataType={setCurrentDataType}
                    handleBack={handleBack}
                    handleNext={handleNext}
                  />
                )}
              </>
            </div>
          )}
          {currentSection.title === "Tools" && <Tools />}
        </div>
      </div>
    </div>
  );
};

export default TrainAiComputer;
