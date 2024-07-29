import { Fieldset } from "primereact/fieldset";
import { Slider } from "primereact/slider";
import { useContext, useState } from "react";
import "primeflex/primeflex.css";
import { GameContext } from "../../../contexts/GameContext";
import { BsRobot } from "react-icons/bs";
import { IoMdPlayCircle } from "react-icons/io";

const ComputerTestGlassUI = ({
  isOpenGlassTest,
  setIsOpenGlassTest,
  currentComputerGlassTest,
  setCurrentComputerGlassTest,
  handleActivate,
  ufoActiveList,
  setUfoActiveList,
}) => {
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);

  const handleClose = () => {
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenGlassTest(false);
    setCurrentComputerGlassTest(-1);
  };

  const handleActivateUFO = () => {
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenGlassTest(false);
    const computerId = currentComputerGlassTest;
    setUfoActiveList((prevList) => {
      const newList = [...prevList];
      newList[computerId - 1] = true;
      return newList;
    });
    setCurrentComputerGlassTest(-1);
  };

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div
        className={`w-full mb-20 flex relative ${
          currentComputerGlassTest <= 0 ? "max-w-md" : "max-w-3xl"
        }`}
      >
        {" "}
        <button
          className="text-red-600 absolute bg-white right-1 top-6 z-[50] border-red-600 
            border px-2 py-0.5 rounded-xl hover:bg-red-100 transition-all duration-200 ease-linear"
          onClick={handleClose}
        >
          X
        </button>
        <Fieldset
          legend={
            currentComputerGlassTest === 0
              ? "Glass Generator"
              : `Glass Classifier Tester ${currentComputerGlassTest}`
          }
          style={{ paddingBottom: "0" }}
          className="bg-cyan-600/40 border-2 w-full items-center justify-center rounded-3xl relative"
        >
          {currentComputerGlassTest <= 0 ? (
            <div className="w-full bg-white/40 rounded-xl border-2 -mt-2.5 h-full p-2 grid grid-cols-5 mx-auto">
              <div className="col-span-full bg-cyan-600/50 rounded-xl border relative">
                <img
                  src="/images/computer-checkpoint.png"
                  className="h-[50vh] mx-auto"
                />
                <button
                  className="absolute flex bottom-5 left-1/2 transform -translate-x-1/2 
                bg-green-600/60 hover:bg-green-600/80 border px-2 py-1.5 rounded-xl"
                  onClick={handleActivate}
                >
                  <IoMdPlayCircle className="text-4xl text-white" />
                  <p className="my-auto text-white ml-1">Reset</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white/40 rounded-xl border-2 -mt-2.5 min-h-[30vh] p-2 grid grid-cols-5">
              <div className="col-span-2 bg-cyan-600/50 rounded-xl border relative">
                <img
                  src="/images/computer-checkpoint.png"
                  className="w-fit h-fit"
                />
                <button
                  className="absolute flex bottom-5 left-1/2 transform -translate-x-1/2 
                bg-green-600/60 hover:bg-green-600/80 border px-2 py-1.5 rounded-xl"
                  onClick={handleActivateUFO}
                >
                  <IoMdPlayCircle className="text-4xl text-white" />
                  <p className="my-auto text-white ml-1">Activate</p>
                </button>
              </div>
              <div className="col-span-3 pl-3">
                <p className="text-white text-lg">
                  There's invisible danger glass here. You have to activate
                  glass classifier to predict which glass is safe or dangerous.
                </p>
                <div className="mt-2">
                  <label className="text-white font-semibold text-lg">
                    Selected Model
                  </label>
                  <div className="bg-green-500/50 w-full px-2 py-2 border rounded-lg">
                    <div className="flex">
                      <BsRobot className="text-4xl text-white" />
                      <p className="my-auto text-white pt-0.5 ml-2">
                        GlassClass01
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-y-2 overflow-y-auto h-full">
                  <label className="text-white font-semibold text-lg -mb-2">
                    Available List
                  </label>
                  <div className="bg-cyan-300/50 w-full px-2 py-2 border rounded-lg flex justify-between">
                    <div className="flex">
                      <BsRobot className="text-4xl text-white" />
                      <p className="my-auto text-white pt-0.5 ml-2">
                        GlassClass01
                      </p>
                    </div>
                    <button className="bg-white px-2.5 rounded-lg">
                      Select
                    </button>
                  </div>
                  <div className="bg-cyan-300/50 w-full px-2 py-2 border rounded-lg">
                    <div className="flex">
                      <BsRobot className="text-4xl text-white" />
                      <p className="my-auto text-white pt-0.5 ml-2">
                        GlassClass02
                      </p>
                    </div>
                  </div>
                  <div className="bg-cyan-300/50 w-full px-2 py-2 border rounded-lg">
                    <div className="flex">
                      <BsRobot className="text-4xl text-white" />
                      <p className="my-auto text-white pt-0.5 ml-2">
                        GlassClass03
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fieldset>
      </div>
    </div>
  );
};

export default ComputerTestGlassUI;
