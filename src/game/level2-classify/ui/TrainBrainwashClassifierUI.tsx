import { Steps } from "primereact/steps";
import { useContext, useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
import { GrDatabase } from "react-icons/gr";
import { FaRegBell, FaDog } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { GameContext } from "../../../contexts/GameContext";

const TrainBrainwashClassifierUI = ({
  isOpenTrainComputer,
  setIsOpenTrainComputer,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);

  const items = [
    {
      label: "Data",
      step: 0,
    },
    {
      label: "Feature and Parameters",
      step: 1,
    },
    {
      label: "Model",
      step: 2,
    },
    {
      label: "Train",
      step: 3,
    },
    {
      label: "Test",
      step: 4,
    },
    {
      label: "Deploy",
      step: 5,
    },
  ];

  const handleClose = () => {
    setIsOpenTrainComputer(false);
    setIsInteracting(false);
    setCurrentHit("");
  };

  const fakeArray = new Array(10).fill(null);

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div className="absolute w-full max-w-4xl h-1/2 mb-10 rounded-2xl border-2 bg-cyan-400/50 overflow-y-hidden">
        <button
          className="text-white bg-red-400/50 absolute right-2 top-2 z-[120] border-red-600 
            border px-2 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 ease-linear"
          onClick={handleClose}
        >
          <RxCrossCircled className="text-2xl my-auto" />
        </button>
        <div className="sticky top-0 bg-cyan-600 pt-3 border-b">
          <p className="text-center text-white text-2xl">
            This is the Train Brainwash Classifier UI
          </p>
          <Steps activeIndex={activeIndex} model={items} />
        </div>
        <div className="w-full pl-4 pr-2 pt-4">
          <div className="w-full h-full bg-white/50 rounded-lg border grid grid-cols-6 p-2">
            <div className="col-span-4 flex flex-col gap-y-2 overflow-y-auto pr-2 pb-14">
              {fakeArray.map((_, index) => (
                <div
                  key={index}
                  className="w-full flex justify-between bg-cyan-400/50 rounded-lg border px-1 py-1 hover:bg-cyan-500/50 cursor-pointer"
                >
                  <div className="flex">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3106/3106703.png"
                      className="w-[40px] h-[40px] ml-1 my-auto bg-neutral-50 rounded-full"
                    />
                    <div className="ml-2">
                      <p className="font-semibold text-lg text-slate-600">
                        Unknown Audio Track
                      </p>
                      <p className="font-semibold text-sm text-white -mt-1">
                        Recorded By ...awdawd
                      </p>
                    </div>
                  </div>
                  <div className="border-2 px-2 h-fit py-2 rounded-full flex my-auto mr-1">
                    <IoPlayOutline className="text-xl font-bold text-white my-auto ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-2 flex flex-col gap-y-2 px-2.5">
              <p className="text-center text-xl text-white font-semibold flex mx-auto h-fit">
                <GrDatabase className="text-lg my-auto" />
                <span className="my-auto ml-2 pt-0.5">Selected Data</span>
              </p>
              <div className="w-full px-2 py-2 flex bg-cyan-400/50 border rounded-lg">
                <FaRegBell className="text-3xl text-cyan-600 my-auto" />
                <p
                  className="my-auto pt-1 font-semibold text-slate-500 ml-2 text-xl w-full 
                flex justify-between pr-2"
                >
                  <span>Doorbell: </span>
                  <span>0</span>
                </p>
              </div>
              <div className="w-full px-2 py-2 flex bg-cyan-400/50 border rounded-lg">
                <FaDog className="text-3xl text-cyan-600 my-auto" />
                <p
                  className="my-auto pt-1 font-semibold text-slate-500 ml-2 text-xl w-full 
                flex justify-between pr-2"
                >
                  <span>Dog Bark: </span>
                  <span>0</span>
                </p>
              </div>
              <div className="w-full px-2 py-2 flex bg-cyan-400/50 border rounded-lg">
                <IoWaterOutline className="text-3xl text-cyan-600 my-auto" />
                <p
                  className="my-auto pt-1 font-semibold text-slate-500 ml-2 text-xl w-full 
                flex justify-between pr-2"
                >
                  <span>Rain: </span>
                  <span>0</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrainBrainwashClassifierUI;
