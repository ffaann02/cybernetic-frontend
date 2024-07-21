import { Steps } from "primereact/steps";

const AiTrainHeader = ({
  handleBack,
  handleNext,
  selectedAIfield,
  aiTypes,
  activeIndex,
  setActiveIndex,
  menuItemsStep
}) => {
  return (
    <>
      <div className="flex justify-between px-4 py-2">
        <div
          className="text-white mb-6 flex gap-x-2 hover:text-cyan-400 cursor-pointer"
          onClick={handleBack}
        >
          <p className="pi pi-chevron-left my-auto text-xl"></p>
          <p className="my-auto text-xl pt-1">Back</p>
        </div>
        <div>
          <div className="text-center text-3xl text-white mt-4 font-bold tracking-wider">
            {aiTypes?.find((type) => type.key === selectedAIfield)?.title}
          </div>
          <div className="text-center">
            <div className="text-white">
              {
                aiTypes?.find((type) => type.key === selectedAIfield)
                  ?.description
              }
            </div>
          </div>
        </div>
        <div
          className="text-white mb-6 flex gap-x-2 hover:text-cyan-400 cursor-pointer"
          onClick={handleNext}
        >
          <p className="my-auto text-xl pt-1">Next</p>
          <p className="pi pi-chevron-right my-auto text-xl"></p>
        </div>
      </div>
      <Steps
        model={menuItemsStep}
        readOnly={false}
        onSelect={(e) => setActiveIndex(e.index)}
        activeIndex={activeIndex}
      />
    </>
  );
};
export default AiTrainHeader;
