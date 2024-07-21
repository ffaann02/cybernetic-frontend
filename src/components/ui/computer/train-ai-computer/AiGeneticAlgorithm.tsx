import AiTrainHeader from "./AiTrainHeader";

const AiGeneticAlgorithm = ({
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
      </div>
    </div>
  );
};
export default AiGeneticAlgorithm;
