import { Checkbox } from "primereact/checkbox";
import { useLevel1Context } from "../../../contexts/SceneContext/Level1Context";

const CheckListGuideUI = () => {
  const {
    imageCollectedList,
    audioCollectedList,
    textCollectedList,
    objectCollectedList,
    numericalCollectedList,
    maxImageCollected,
    maxAudioCollected,
    maxTextCollected,
    maxObjectCollected,
    maxNumericalCollected
  } = useLevel1Context();

  return (
    <div className="absolute z-[50] left-4 top-4 p-2 max-w-[17rem] w-full">
      <div className="bg-cyan-400/50 w-full rounded-t-lg py-2">
        <h1 className="text-2xl text-center text-white">CHECK LIST</h1>
      </div>
      <div className="w-full bg-white/80 -mt-0.5 px-4 py-2 rounded-b-md">
        <div className="pb-1 border-b border-cyan-600">
          <p className="text-lg">Data Collection</p>
        </div>
        <div className="mt-2 ml-2 flex flex-col gap-y-2">
          <div className="flex align-items-center">
            <Checkbox
              checked={imageCollectedList.length >= maxImageCollected}
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Image</span>
              <span>{imageCollectedList.length}/{maxImageCollected}</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={audioCollectedList.length >= maxAudioCollected}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Audio</span>
              <span>{audioCollectedList.length}/{maxAudioCollected}</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={textCollectedList.length >= maxTextCollected}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Text</span>
              <span>{textCollectedList.length}/{maxTextCollected}</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={objectCollectedList.length >= maxObjectCollected}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Object</span>
              <span>{objectCollectedList.length}/{maxObjectCollected}</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={numericalCollectedList.length >= maxNumericalCollected}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Numerical</span>
              <span>{numericalCollectedList.length}/{maxNumericalCollected}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckListGuideUI;
