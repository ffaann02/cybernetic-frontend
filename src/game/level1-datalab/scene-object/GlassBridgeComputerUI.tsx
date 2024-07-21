import { Fieldset } from "primereact/fieldset";

const GlassBridgeComputerUI = () => {
  return (
    <div
      className={`bg-black/70 h-full w-full fixed bottom-0 z-[1000] 
         justify-center items-center hidden`}
    >
      <div className="flex w-full max-w-3xl gap-x-4 relative">
        <Fieldset
          legend="Security Glass Bridge Checkpoint"
          className="w-full relative px-2 mt-4 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
        >
          <div className="w-full grid grid-cols-3 gap-x-4">
            <div className="col-span-1 border rounded-xl bg-white/30">
              <img src="/images/computer-checkpoint.png" />
            </div>
            <div className="col-span-2 h-full border rounded-xl bg-white/30 p-4">
              <p className="text-white text-lg">
                There're the invisible danger glass out there. You have to
                activate the classifier to cross here.
              </p>
              <div className="w-full h-20 p-2 bg-green-400/50 hover:bg-cyan-400/50 border rounded-xl mt-2 flex cursor-pointer">
                <div className="m-auto flex flex-col text-center gap-y-1">
                  <p className="pi pi-microchip-ai text-3xl"></p>
                  <p>Select AI Classifier</p>
                </div>
              </div>
              <button className=" mt-2 px-4 py-2 bg-cyan-400 font-bold tracking-wider rounded-lg border-slate-400 border-2">
                Activate
              </button>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
};
export default GlassBridgeComputerUI;
