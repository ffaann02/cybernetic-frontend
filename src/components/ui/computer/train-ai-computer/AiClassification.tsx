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
import AiTrainHeader from "./AiTrainHeader";

const AiClassification = ({
  aiTypes,
  selectedAIfield,
  menuItemsStep,
  activeIndex,
  setActiveIndex,
  selectedData,
  setSelectedData,
  isTraining,
  setIsTraining,
  dataStorage,
  setDataStorage,
  groupAndCountData,
  classificationModelList,
  dataType,
  currentDataType,
  setCurrentDataType,
  handleBack,
  handleNext,
}) => {
  return (
    <div className="w-full h-full px-20 pt-6">
      <div className="border-2 rounded-2xl pb-10 bg-black/60 relative">
        <AiTrainHeader
          handleBack={handleBack}
          handleNext={handleNext}
          selectedAIfield={selectedAIfield}
          aiTypes={aiTypes}
          activeIndex={activeIndex}
          menuItemsStep={menuItemsStep}
          setActiveIndex={setActiveIndex}
        />
        {selectedAIfield === "ml-classification" && (
          <div className="w-full mt-2">
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
                                      setSelectedData([...selectedData, data]);
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
                                      (_, filterIndex) => index !== filterIndex
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
                  <h3 className="text-xl text-center mb-2">Decision Tree</h3>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5139/5139787.png"
                    className="w-40 mx-auto p-2 bg-white/50 rounded-xl border-2 border-cyan-400"
                  />
                  <p className="text-lg mt-2">
                    A decision tree model is a type of machine learning model
                    that uses a tree-like graph of decisions and their possible
                    consequences to predict the target value of a new instance.
                  </p>
                </div>
              </div>
            )}
            {activeIndex === 3 && isTraining && (
              <div className="text-white px-20 mt-2 w-full">
                <div className="text-xl mt-4 bg-white/30 rounded-lg px-4 py-2 pb-4 border">
                  <h3 className="">Split Dataset Ratio</h3>
                  <div className="flex gap-x-2">
                    <Tag value="Train" className="text-lg font-normal"></Tag>
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
            {activeIndex === 3 && !isTraining && (
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
            <div className="mt-2 ml-20"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AiClassification;
