import { useTutorialContext } from "../../../contexts/SceneContext/TutorialContext";
import IdleRobotGif from "../../../assets/assistant-bot/gif/Idle.gif";
const MovementTutorialUI = () => {


    const {setIsOk} = useTutorialContext();

  return (
    <div
      className="absolute inset-0 w-full pt-4 pb-4 bg-gradient-to-r from-slate-600/30 via-black/80 to-slate-600/30
      border border-l-0 border-r-0 h-fit gap-x-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      mx-auto z-50 justify-center"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <img src={IdleRobotGif} className="absolute top-0 right-0 scale-110 -scale-x-100"/>
      <h1 className="text-center text-2xl tracking-wider font-semibold text-yellow-400">
        BASIC MOVEMENT TUTORIAL
      </h1>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col">
          <div className="flex flex-col mx-auto">
            <div className="w-fit mx-auto px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
              <span className="mt-2 font-bold text-slate-500 text-xl">W</span>
            </div>
            <div className="flex gap-x-1 w-full mt-1">
              <div className="px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
                <span className="mt-2 font-bold text-slate-500 text-xl">A</span>
              </div>
              <div className="px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
                <span className="mt-2 font-bold text-slate-500 text-xl">S</span>
              </div>
              <div className="px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
                <span className="mt-2 font-bold text-slate-500 text-xl">D</span>
              </div>
            </div>
          </div>
          <p className="text-white z-[100] mt-2 text-xl">Character Movement</p>
        </div>
        <div className="flex flex-col mt-[3.25rem]">
          <div className="flex flex-col mx-auto">
            <div className="w-52 mx-auto px-3 pt-2.5 pb-2 bg-neutral-50 z-50 rounded-md border-b-neutral-400 animate-border-bottom-scale">
              <span className="mt-2 font-bold text-slate-500 text-xl">
                Space
              </span>
            </div>
          </div>
          <p className="text-white z-[100] mt-2 text-xl text-center">Jump</p>
        </div>
      </div>
      <div className="w-full justify-center flex mt-4">
        <button className="text-white text-lg bg-cyan-400/50 hover:bg-cyan-500/50 flex text-center px-4 py-2 rounded-lg"
            onClick={()=>{
                setIsOk(true);
            }}>
          Okay, let's start
        </button>
      </div>
    </div>
  );
};
export default MovementTutorialUI;
