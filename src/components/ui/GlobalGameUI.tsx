import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { LiaRobotSolid } from "react-icons/lia";
import { MdCancelPresentation, MdCategory } from "react-icons/md";
import { TbBorderNone } from "react-icons/tb";
import PlayerMainUI from "./main-ui/PlayerMainUI";
import { Badge } from "primereact/badge";
import { BsClipboardData, BsGraphUp } from "react-icons/bs";
import { PiBrain, PiEggCrack, PiEye } from "react-icons/pi";
import { Carousel } from "primereact/carousel";
import { Steps } from "primereact/steps";
import { classNames } from "primereact/utils";
import { FaHSquare } from "react-icons/fa";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
const AskForInputKeyDown = ({ title }: { title: string }) => {
  return (
    <div className="absolute z-[100] bottom-44 left-1/2 transform -translate-x-1/2">
      <h1 className="text-white text-3xl">{title}</h1>
    </div>
  );
};

const AiModelComputer = ({ setIsCoding }: { setIsCoding: any }) => {
  const { dataStorage, setDataStorage } = useContext(GameContext);

  // Define an array of objects for each section
  const sections = [
    { title: "Data Storage" },
    { title: "Train AI Model" },
    { title: "Tools" },
    { title: "Level Info" },
  ];

  const [currentSection, setCurrentSection] = useState(sections[0]);
  const handleClose = () => {
    setIsCoding(false);
  };

  const initData = [
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "water", // Replaced "type" with "element"
      size: "tiny",
      color: "blue",
      speed: 3,
      mass: 20,
      armor: 10,
      attack: "chase",
      energy: 100,
      pattern: "",
      weakness: "lightning", // Fire counters water
      detection_range: 10,
      image_url: "/images/slime_default.png",
    },
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "water", // Replaced "type" with "element"
      size: "tiny",
      color: "blue",
      speed: 3,
      mass: 20,
      armor: 10,
      attack: "chase",
      energy: 100,
      pattern: "",
      weakness: "lightning", // Fire counters water
      detection_range: 10,
      image_url: "/images/slime_default.png",
    },
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "fire",
      size: "tiny",
      color: "orange",
      speed: 5,
      mass: 50,
      armor: 8,
      attack: "chase",
      energy: 150,
      pattern: "",
      weakness: "water", // Water counters fire
      detection_range: 8,
      image_url: "/images/slime_default.png",
    },
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "earth",
      size: "tiny",
      color: "green",
      speed: 1,
      mass: 200,
      armor: 20,
      attack: "chase",
      energy: 200,
      pattern: "",
      weakness: "ice", // Ice counters earth (brittle rock)
      detection_range: 5,
      image_url: "/images/slime_default.png",
    },
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "lightning",
      size: "tiny",
      color: "yellow",
      speed: 10,
      mass: 2,
      armor: 5,
      attack: "chase",
      energy: 80,
      pattern: "erratic",
      weakness: "metal",
      detection_range: 3,
      image_url: "/images/slime_default.png",
    },
    {
      data_type: "enemy",
      name: "Robotic Slime - enemy",
      element: "metal",
      size: "tiny",
      color: "black",
      speed: 10,
      mass: 2,
      armor: 5,
      attack: "chase",
      energy: 80,
      pattern: "erratic",
      weakness: "fire",
      detection_range: 3,
      image_url: "/images/slime_default.png",
    },
  ];

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

  const [selectedModel, setSelectedModel] = useState<any>(null);
  const aiTypeCardTemplate = (model) => {
    const { Icon } = model;
    return (
      <div
        onClick={() => {
          setSelectedModel(model.key);
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
    setDataStorage(initData);
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
  const dataType = [
    { title: "Enemy" },
    { title: "Object" },
    { title: "Image" },
    { title: "Text" },
    { title: "Audio" },
  ];

  const classificationMenuItemsStep = [
    {
      id: "0",
      index: 0,
      label: "Problem",
      labelClassName: "bg-red-200",
    },
    {
      id: "1",
      index: 1,
      label: "Data",
      labelClassName: "bg-red-200",
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
  const [classificationModelList, setClassificationModelList] = useState<any>([
    {
      name: "Logistic Regression",
      description: "A logistic regression model.",
      key: "logistic-regression",
    },
    {
      name: "Decision Tree",
      description: "A decision tree model.",
      key: "decision-tree",
    },
    {
      name: "Random Forest",
      description: "A random forest model.",
      key: "random-forest",
    },
    {
      name: "Support Vector Machine",
      description: "A support vector machine model.",
      key: "svm",
    },
    {
      name: "K-Nearest Neighbors",
      description: "A K-nearest neighbors model.",
      key: "knn",
    },
    {
      name: "Naive Bayes",
      description: "A naive bayes model.",
      key: "naive-bayes",
    },
    {
      name: "Neural Network",
      description: "A neural network model.",
      key: "neural-network",
    },
    {
      name: "Convolutional Neural Network",
      description: "A convolutional neural network model.",
      key: "cnn",
    },
    {
      name: "Recurrent Neural Network",
      description: "A recurrent neural network model.",
      key: "rnn",
    },
    {
      name: "Long Short-Term Memory",
      description: "A long short-term memory model.",
      key: "lstm",
    },
  ]);

  const [isTraining, setIsTraining] = useState(false);

  return (
    <div className="absolute w-full z-[1000] flex h-full top-0 p-16 pt-10 left-1/2 transform -translate-x-1/2">
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
          <>
            <h2 className="ml-20 mt-4 text-xl mb-1 text-white">Data Type</h2>
            <div className="px-20 flex gap-x-4">
              {dataType.map((type) => (
                <button
                  key={type.title}
                  className={`px-4 py-2 rounded-md border-2 transition-all ease-linear duration-200 ${
                    currentDataType === type.title
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-neutral-50 border-slate-400 text-neutral-400"
                  }`}
                  onClick={() => {
                    setCurrentDataType(type.title);
                  }}
                >
                  {type.title}
                </button>
              ))}
            </div>
            <div className="flex h-full">
              <div
                className="mt-6 w-3/5 flex flex-col gap-y-4 pl-20 pr-4 overflow-y-scroll pb-[20%]"
                id="data-storage"
              >
                {dataStorage.length > 0 &&
                  Object.values(groupAndCountData(dataStorage)).map(
                    (data, index) => {
                      const colorClasses = {
                        red: "bg-red-600/50",
                        blue: "bg-blue-600/50",
                        green: "bg-green-600/50",
                        orange: "bg-orange-600/50",
                        yellow: "bg-yellow-600/50",
                        black: "bg-black/50",
                      };
                      return (
                        <div
                          key={`${data.element}-${data.name}-${index}`}
                          className="w-full bg-white/20 flex-grow p-3 rounded-lg border-2 flex gap-x-2
                      hover:scale-105 transition-all duration-200 ease-linear cursor-pointer hover:shadow-md 
                      hover:shadow-blue-400/100 hover:bg-cyan-400/10 hover:border-cyan-400/50"
                        >
                          <div className="w-24 h-24 rounded-md border relative">
                            <div className="w-8 h-8 absolute -right-3 -top-1.5 z-10 bg-cyan-400 text-center rounded-full pt-0.5 p-1">
                              <p className="mt-0.5 font-semibold text-slate-500">
                                {data.count}
                              </p>
                            </div>
                            <div
                              className={`absolute w-full h-full ${
                                colorClasses[data.color]
                              }`}
                            ></div>
                            <img
                              className="w-full h-full p-2"
                              src={
                                data.image_url || "/images/slime_default.png"
                              }
                              alt={data.name}
                            />
                          </div>
                          <div className="flex flex-col justify-center ml-2">
                            <p className="text-white font-semibold">
                              {data.name}
                            </p>
                            <p className="text-white">
                              Energy Source: {data.element}
                            </p>
                            <p className="text-white">
                              Weakness: {data.element}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
              <div className="w-2/5 p-4 h-full pb-[18rem]">
                <div className="border-2 rounded-xl h-full flex">
                  <div className="m-auto text-center flex flex-col gap-y-4">
                    <TbBorderNone className="text-[5rem] mx-auto text-white" />
                    <p className="text-xl text-white">
                      No data selected, please select a data to view details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {currentSection.title === "Train AI Model" &&
          selectedModel === null && (
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
        {selectedModel && (
          <div className="w-full h-full px-20 pt-6">
            <div className="border-2 rounded-2xl pb-10 bg-black/60 relative">
              <div className="flex justify-between px-4 py-2">
                <div
                  className="text-white mb-6 flex gap-x-2 hover:text-cyan-400 cursor-pointer"
                  onClick={() => {
                    setActiveIndex((prev) => prev - 1);
                  }}
                >
                  <p className="pi pi-chevron-left my-auto text-xl"></p>
                  <p className="my-auto text-xl pt-1">Back</p>
                </div>
                <div>
                  <div className="text-center text-3xl text-white mt-4 font-bold tracking-wider">
                    {aiTypes.find((type) => type.key === selectedModel)?.title}
                  </div>
                  <div className="text-center">
                    <div className="text-white">
                      {
                        aiTypes.find((type) => type.key === selectedModel)
                          ?.description
                      }
                    </div>
                  </div>
                </div>
                <div
                  className="text-white mb-6 flex gap-x-2 hover:text-cyan-400 cursor-pointer"
                  onClick={() => {
                    setActiveIndex((prev) => prev + 1);
                  }}
                >
                  <p className="my-auto text-xl pt-1">Next</p>
                  <p className="pi pi-chevron-right my-auto text-xl"></p>
                </div>
              </div>
              {selectedModel === "ml-classification" && (
                <div className="w-full mt-2">
                  <Steps
                    model={classificationMenuItemsStep}
                    readOnly={false}
                    onSelect={(e) => setActiveIndex(e.index)}
                    activeIndex={activeIndex}
                  />
                  {activeIndex === 0 && (
                    <div className="px-[10%] mt-4 grid grid-cols-3 gap-x-4">
                      <div className="border p-2 rounded-xl bg-white/20">
                        <p className="text-white text-xl font-semibold text-center">
                          Object
                        </p>
                        <p className="text-white text-sm text-center">
                          Select object you want to add AI
                        </p>
                        <div className="h-20 w-full bg-cyan-400/50 rounded-xl mt-2 border flex cursor-pointer">
                          <p className="pi pi-plus-circle m-auto text-2xl text-green-400"></p>
                        </div>
                      </div>
                      <div className="border p-2 rounded-xl bg-white/20">
                        <p className="text-white text-xl font-semibold text-center">
                          Target
                        </p>
                        <p className="text-white text-sm text-center">
                          Select target you want to predict
                        </p>
                        <div className="h-20 w-full bg-cyan-400/50 rounded-xl mt-2 border flex cursor-pointer">
                          <p className="pi pi-plus-circle m-auto text-2xl text-green-400"></p>
                        </div>
                      </div>
                      <div className="border p-2 rounded-xl bg-white/20">
                        <p className="text-white text-xl font-semibold text-center">
                          Save
                        </p>
                        <p className="text-white text-sm text-center">
                          Adjust the saving setting
                        </p>
                        <div
                          className="p-inputgroup flex-1 mt-2 h-10 rounded-md
                          bg-cyan-200/50"
                        >
                          <span
                            className="p-inputgroup-addon my-auto py-2 h-full border-r
                            border-cyan-400 bg-transparent"
                          >
                            <i className="pi pi-file text-white"></i>
                          </span>
                          <InputText
                            placeholder="File name"
                            unstyled
                            className="py-2 h-full
                          pl-2 w-full outline-none bg-transparent text-white placeholder:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeIndex === 1 && (
                    <div className="px-10 mt-4">
                      <div className="bg-white/50 border px-4 py-3 rounded-lg w-full flex">
                        <div className="pr-2 w-1/2">
                          <div className="text-white font-semibold text-xl flex gap-x-2">
                            <BsClipboardData className="my-auto" />
                            <p className="my-auto">Available Data List</p>
                          </div>
                          <div className="flex flex-col gap-y-2 mt-1">
                            {dataStorage.length > 0 &&
                              dataStorage.map((data, index) => {
                                const colorClasses = {
                                  red: "bg-red-600/50",
                                  blue: "bg-blue-600/50",
                                  green: "bg-green-600/50",
                                  orange: "bg-orange-600/50",
                                  yellow: "bg-yellow-600/50",
                                  black: "bg-black/50",
                                };

                                const isSelected = selectedData.some(
                                  (selected) =>
                                    selected.name === data.name &&
                                    selected.data_type === data.data_type &&
                                    selected.element === data.element &&
                                    selected.size === data.size
                                );

                                return (
                                  <div
                                    key={index}
                                    className={`border rounded-lg justify-between p-1 pr-1.5 flex 
                      ${
                        isSelected
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-cyan-200/50 cursor-pointer"
                      }`}
                                  >
                                    <div className="flex">
                                      <div className="w-10 relative">
                                        <div
                                          className={`absolute w-full h-full ${
                                            colorClasses[data.color]
                                          } z-10 rounded-lg`}
                                        ></div>
                                        <img
                                          src={data.image_url}
                                          className="rounded-lg"
                                        />
                                      </div>
                                      <p className="my-auto text-lg ml-2 font-semibold text-white">
                                        {data.name}
                                      </p>
                                    </div>
                                    <div className="my-auto">
                                      <Button
                                        label="Select"
                                        text
                                        raised
                                        size="small"
                                        className={`bg-white/75 py-2 ${
                                          isSelected
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          if (!isSelected) {
                                            setSelectedData([
                                              ...selectedData,
                                              data,
                                            ]);
                                          }
                                        }}
                                        disabled={isSelected}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <Divider layout="vertical" />
                        <div className="w-1/2">
                          <div className="text-white font-semibold text-xl flex gap-x-2">
                            <BsClipboardData className="my-auto text-green-300" />
                            <p className="my-auto">Selected Data</p>
                          </div>
                          <div className="flex flex-col gap-y-2 mt-1">
                            {selectedData.length <= 0 && (
                              <div className="text-slate-200 text-xl mt-2">
                                No data selected, please select a data to create
                                training dataset
                              </div>
                            )}
                            {selectedData &&
                              selectedData.length > 0 &&
                              selectedData.map((data, index) => {
                                const colorClasses = {
                                  red: "bg-red-600/50",
                                  blue: "bg-blue-600/50",
                                  green: "bg-green-600/50",
                                  orange: "bg-orange-600/50",
                                  yellow: "bg-yellow-600/50",
                                  black: "bg-black/50",
                                };
                                return (
                                  <div
                                    className="border rounded-lg p-1 flex justify-between hover:bg-green-200/50
                            cursor-pointer"
                                  >
                                    <div className="flex">
                                      <div className="w-10 relative">
                                        <div
                                          className={`absolute w-full h-full ${
                                            colorClasses[data.color]
                                          } z-10 rounded-lg`}
                                        ></div>
                                        <img
                                          src={data.image_url}
                                          className="rounded-lg"
                                        />
                                      </div>
                                      <p className="my-auto text-lg ml-2 font-semibold text-white">
                                        {data.name}
                                      </p>
                                    </div>
                                    <Button
                                      icon="pi pi-times"
                                      severity="danger"
                                      aria-label="Cancel"
                                      size="small"
                                      className="py-2 bg-white/90"
                                      text
                                      onClick={() => {
                                        setSelectedData(
                                          selectedData.filter(
                                            (_, filterIndex) =>
                                              index !== filterIndex
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeIndex === 2 && (
                    <div className="text-white px-20 mt-4 w-full grid grid-cols-5 gap-x-4">
                      <div className="col-span-2 flex flex-col gap-y-2">
                        {classificationModelList.map((model, index) => (
                          <div
                            className="w-full bg-white/20 rounded-lg px-4 py-2
                            border text-white hover:bg-cyan-400/50 cursor-pointer"
                          >
                            <p>{model.name}</p>
                          </div>
                        ))}
                      </div>
                      <div className="col-span-3 bg-white/20 rounded-lg h-fit border p-4 pt-3">
                        <h3 className="text-xl text-center mb-2">
                          Decision Tree
                        </h3>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/5139/5139787.png"
                          className="w-40 mx-auto p-2 bg-white/50 rounded-xl border-2 border-cyan-400"
                        />
                        <p className="text-lg mt-2">
                          A decision tree model is a type of machine learning
                          model that uses a tree-like graph of decisions and
                          their possible consequences to predict the target
                          value of a new instance.
                        </p>
                      </div>
                    </div>
                  )}
                  {activeIndex === 3 && !isTraining && (
                    <div className="text-white px-20 mt-2 w-full">
                      <div className="text-xl mt-4 bg-white/30 rounded-lg px-4 py-2 pb-4 border">
                        <h3 className="">Split Dataset Ratio</h3>
                        <div className="flex gap-x-2">
                          <Tag
                            value="Train"
                            className="text-lg font-normal"
                          ></Tag>
                          <Tag
                            severity="success"
                            value="Test"
                            className="text-lg font-normal"
                          ></Tag>
                        </div>
                        <Splitter
                          style={{ height: "200px" }}
                          className="rounded-xl bg-transparent mt-2"
                        >
                          <SplitterPanel className="flex align-items-center justify-content-center p-2 bg-cyan-400/50 rounded-l-xl">
                            <p className="m-auto text-3xl">70%</p>
                          </SplitterPanel>
                          <SplitterPanel className="flex align-items-center justify-content-centerp-2 bg-green-400/50 rounded-r-xl">
                            <p className="m-auto text-3xl">30%</p>
                          </SplitterPanel>
                        </Splitter>
                      </div>
                    </div>
                  )}
                  {activeIndex === 3 && isTraining && (
                    <div className="px-20 py-10">
                      <div className="bg-white/50 w-full h-full border rounded-lg pt-2 px-6 pb-4 flex flex-col">
                        <ProgressSpinner className="mx-auto p-20" />
                        <p className="text-white font-semibold text-xl tracking-wider mb-1">
                          Progress
                        </p>
                        <ProgressBar value={30}></ProgressBar>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 ml-20">
                    <button
                      className="px-4 py-2 bg-cyan-400/50 text-xl rounded-lg border flex"
                      onClick={() => {
                        setIsTraining((prev) => !prev);
                      }}
                    >
                      <p className="pi pi-check-circle my-auto mr-2 pb-0.5 text-xl text-green-400"></p>
                      <p className="my-auto">Train AI</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GlobalGameUI = () => {
  const {
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding,
    isInteracting,
    setIsInteracting,
  } = useContext(GameContext);
  return (
    <>
      {/* <PlayerMainUI /> */}
      <PlayerMainUI />
      {currentHit?.includes("computer") &&
        (isCoding ? (
          <AskForInputKeyDown title="Press E to Leave Computer" />
        ) : (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ))}
      {currentHit === "assistant-bot" &&
        (isInteracting ? (
          <AskForInputKeyDown title="Press E to Leave Assistant Bot" />
        ) : (
          <AskForInputKeyDown title="Press E to Interact with Assistant Bot" />
        ))}

      {currentHit === "door" && (
        <AskForInputKeyDown title="Press E to Enter The Door" />
      )}
      {currentHit?.includes("guard") && (
        <AskForInputKeyDown title="Press E to Interact with Guard" />
      )}

      {isCoding && <AiModelComputer setIsCoding={setIsCoding} />}
    </>
  );
};
export default GlobalGameUI;
