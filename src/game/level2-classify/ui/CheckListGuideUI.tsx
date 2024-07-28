import { Checkbox } from "primereact/checkbox";

const CheckListGuideUI = ({
  textCollectedList = [],
  imageCollectedList = [],
  audioCollectedList = [],
}) => {

  return (
    <div className="absolute z-[50] left-4 top-4 p-2 max-w-[17rem] w-full">
      <div className="bg-cyan-400/50 w-full rounded-t-lg py-2">
        <h1 className="text-2xl text-center text-white">CHECK LIST</h1>
      </div>
      <div className="w-full bg-white/80 -mt-0.5 px-4 py-2 rounded-b-md">
        <div className="pb-1 border-b border-cyan-600">
          <p className="text-lg">Level Mission</p>
        </div>
        <div className="mt-2 ml-2 flex flex-col gap-y-2">
          <div className="flex align-items-center">
            <Checkbox
              checked={imageCollectedList.length >= 5}
            />
            <label
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Destroy All Slimes</span>
              <span>{imageCollectedList.length}/5</span>
            </label>
          </div>
        </div>
        <div className="pb-1 border-b border-cyan-600 mt-3">
          <p className="text-lg">Guide</p>
        </div>
        <div className="mt-2 ml-2 flex flex-col gap-y-2">
          <div className="flex align-items-center">
            <Checkbox
              checked={imageCollectedList.length >= 5}
            />
            <label
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Move a Speaker</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              checked={imageCollectedList.length >= 5}
            />
            <label
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Find Audio Data</span>
              <span>{imageCollectedList.length}/8</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              checked={imageCollectedList.length >= 5}
            />
            <label
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Find Video Footage</span>
              <span>{imageCollectedList.length}/2</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckListGuideUI;
