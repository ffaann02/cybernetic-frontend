import { Checkbox } from "primereact/checkbox";
import { useTutorialContext } from "../../../contexts/SceneContext/TutorialContext";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const TutorialMovementChecklistUI = ({}) => {
  const { hitCheckpoints } = useTutorialContext();

  return (
    <div className="absolute z-[50] left-4 top-4 p-2 max-w-[17rem] w-full">
      <div className="bg-cyan-400/50 w-full rounded-t-lg py-2">
        <h1 className="text-2xl text-center text-white">Mission</h1>
      </div>
      <div className={`w-full ${hitCheckpoints >= 4 ? 'bg-green-100' : 'bg-white/80'} -mt-0.5 px-4 py-2 rounded-b-md`}>
        <div className="pb-1 border-b border-cyan-600">
          <p className="text-lg">Movement Tutorial</p>
        </div>
        <div className="mt-2 ml-1 flex flex-col gap-y-2">
          <div className="flex align-items-center">
            <Checkbox checked={hitCheckpoints >= 4} />
            <label className="ml-2 text-sm flex justify-between w-full">
              <span>Collect Arrow</span>
              <span>{hitCheckpoints}/4</span>
            </label>
          </div>
          <p className="text-sm text-slate-500">
            Use key "WASD" and "Space" to control movement and collect the arrow
            in this room.
          </p>
          {hitCheckpoints >= 4 && (
            <div className="flex -ml-1">
              <IoIosCheckmarkCircleOutline className="text-3xl text-green-600 my-auto" />
              <p className="text-green-600 ml-2 text-sm font-semibold">
                Success!, let's talk with <br /> X-Alpha
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialMovementChecklistUI;