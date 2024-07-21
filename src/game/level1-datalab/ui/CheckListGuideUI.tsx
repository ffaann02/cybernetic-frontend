import { Checkbox } from "primereact/checkbox";

const CheckListGuideUI = ({
  textCollectedList,
  imageCollectedList,
  audioCollectedList,
}) => {
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
              checked={imageCollectedList.length >= 5}
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
              <span>Cat Image</span>
              <span>{imageCollectedList.length}/5</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={audioCollectedList.length >= 5}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Audio</span>
              <span>{audioCollectedList.length}/5</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              checked={textCollectedList.length >= 3}
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Text</span>
              <span>{textCollectedList.length}/3</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Object</span>
              <span>1/5</span>
            </label>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="pizza"
              value="Cheese"
              className="my-auto"
              //   onChange={onIngredientsChange}
              //   checked={ingredients.includes("Cheese")}
            />
            <label
              htmlFor="ingredient1"
              className="ml-2 text-sm flex justify-between w-full"
            >
              <span>Numerical</span>
              <span>1/2</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckListGuideUI;
