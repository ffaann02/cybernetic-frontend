const MovementGuideUI = () => {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 w-fit h-fit flex gap-x-10 top-14 right-14 
      mx-auto z-50"
      >
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
    </div>
  );
};
export default MovementGuideUI;
