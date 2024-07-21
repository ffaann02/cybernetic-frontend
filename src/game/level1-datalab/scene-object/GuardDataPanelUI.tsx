import { Fieldset } from "primereact/fieldset";
import { MeterGroup } from "primereact/metergroup";
import { useContext } from "react";
import { MdCancel } from "react-icons/md";
import { GameContext } from "../../../contexts/GameContext";

const GuardDataPanelUI = ({
  showDialog,
  setShowDialog,
  values,
  inputValues,
  preparedImages,
  selectedIndices,
  toggleSelection,
}) => {

  const { setIsInteracting } = useContext(GameContext);

  return (
    <div
      className={`bg-black/70 h-full w-full fixed bottom-0 z-[10000] ${
        showDialog ? "flex" : "hidden"
      } justify-center items-center`}
    >
      <div className="flex max-w-4xl gap-x-4 relative">
        <div className="w-[50%] -left-[40%] -bottom-[25%] h-fit absolute -z-0">
          <img
            className="w-full p-2 rounded-full"
            src="/images/guard-profile.png"
          />
        </div>
        <div>
          <Fieldset
            legend="Robot Guard"
            className="-ml-2 z-[20] relative px-2 mt-4 min-w-80 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
          >
            <div className="text-white">
              <h2 className="text-xl">
                I'm an elevator controller robot. If you want to go up, please
                give me the data source as a token. I will check if you have the
                right token to go up.
              </h2>
              <div className="grid grid-cols-6 mt-2">
                <div className="h-80 col-span-2 p-2 relative">
                  <div className="absolute h-full top-0 w-1 py-2 flex flex-col-reverse" id="meter-container">
                    <div className="bg-green-600 h-[20%]"></div>
                    <div className="bg-orange-400 h-[15%]"></div>
                    <div className="bg-cyan-400 h-[35%]"></div>
                    <div className="bg-slate-400 h-[15%]"></div>
                    <div className="bg-red-600 h-[15%]"></div>
                  </div>
                  <div className="border-2 h-[20%] w-[50%] mx-auto rounded-t-xl border-b-0 -mb-0.5"></div>
                  <div className="border-2 h-[80%] w-[75%] mx-auto rounded-xl relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[54%] rounded-b-xl">
                      <div className="h-[44.4%] bg-cyan-400"></div>
                      <div className="h-[24.1%] bg-orange-400"></div>
                      <div className="h-[31.5%] bg-green-400"></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col p-4">
                  <div className="w-full bg-white/50 rounded-xl rounded-r-none border-2 overflow-y-scroll h-60 grid grid-cols-6 gap-2 p-2">
                    {/* {Array.from({ length: 10 }).map((_, index) => ( */}
                    {/* {preparedImages.map((src, index) => (
                    <div
                      key={index}
                      className={`h-20 ${selectedIndices.includes(index)
                        ? "border-green-600 border-2 bg-green-400/50"
                        : "border-2 opacity-50"
                        } bg-cyan-400/50 rounded-xl cursor-pointer hover:bg-black/10 flex justify-center items-center`}
                      onClick={() => toggleSelection(index)}
                    >
                      <img src={src} className="w-full h-full p-2" />
                    </div>
                  ))} */}
                    {/* ))} */}
                  </div>
                </div>
              </div>
              <div className="px-10">
                <div className="border px-3 py-1 rounded-lg bg-white/20">
                  <p>Requirement Token</p>
                  <MeterGroup values={values} />
                </div>
              </div>
              {/* <div className="px-10 mt-2">
                <div className="border px-3 py-1 rounded-lg bg-red-400/50">
                  <p>Your Input</p>
                  <MeterGroup values={inputValues} />
                </div>
              </div> */}
            </div>
          </Fieldset>
          <div className="absolute top-14 right-3 z-50 text-sm">
            <button
              className="px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-500/70 flex gap-x-2 items-center"
              onClick={() => {
                setShowDialog(false);
                setIsInteracting(false);
              }}
            >
              <MdCancel className="textes-white text-xl" />
              <span className="text-white">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuardDataPanelUI;
