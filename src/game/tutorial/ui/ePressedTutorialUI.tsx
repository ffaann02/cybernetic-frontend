import { useTutorialContext } from "../../../contexts/SceneContext/TutorialContext";
import IdleRobotGif from "../../../assets/assistant-bot/gif/Idle.gif";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
const EPressedTutorialUI = () => {
  const { setIsInteracting } = useContext(GameContext);
  const { setIsOk } = useTutorialContext();

  return (
    <div
      className="absolute inset-0 w-full pt-4 pb-4 bg-gradient-to-r from-slate-600/30 via-black/80 to-slate-600/30
      border border-l-0 border-r-0 h-fit gap-x-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      mx-auto z-50 justify-center"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <img
        src={IdleRobotGif}
        className="absolute top-0 right-0 scale-110 -scale-x-100"
      />
      <h1
        className="text-center text-2xl tracking-wider font-semibold text-yellow-400 
        flex gap-x-2 justify-center mx-auto"
      >
        <span className="my-auto">PRESS</span>
        <span>
          {" "}
          <div className="w-fit mx-auto px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
            <span className="mt-2 font-bold text-slate-500 text-xl">E</span>
          </div>
        </span>
        <span className="my-auto"> to INTERACT WITH EVERYTHING</span>
      </h1>
      <div className="flex gap-x-4 justify-center mt-5">
        <div>
          <img src="" className="w-40 h-40 bg-white rounded-xl border-2" />
          <p className="text-center mt-2 text-white">Lift Object</p>
        </div>
        <div>
          <img src="" className="w-40 h-40 bg-white rounded-xl border-2" />
          <p className="text-center mt-2 text-white">Open/Close</p>
        </div>
        <div>
          <img src="" className="w-40 h-40 bg-white rounded-xl border-2" />
          <p className="text-center mt-2 text-white">Control Computer</p>
        </div>
      </div>
      <div className="w-full justify-center flex mt-4">
        <button
          className="text-white text-lg bg-cyan-400/50 hover:bg-cyan-500/50 flex text-center px-4 py-2 rounded-lg"
          onClick={() => {
            setIsOk(true);
            setIsInteracting(false);
          }}
        >
          Okay, let's try
        </button>
      </div>
    </div>
  );
};
export default EPressedTutorialUI;
