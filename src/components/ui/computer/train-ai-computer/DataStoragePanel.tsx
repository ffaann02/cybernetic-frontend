import { TbBorderNone } from "react-icons/tb";

const DataStoragePanel = ({
  dataStorage,
  setDataStorage,
  dataType,
  currentDataType,
  setCurrentDataType,
  groupAndCountData,
}: {
  dataStorage: any;
  setDataStorage: React.Dispatch<React.SetStateAction<any>>;
  dataType: any;
  currentDataType: string;
  setCurrentDataType: React.Dispatch<React.SetStateAction<string>>;
  groupAndCountData: void;
}) => {
  return (
    <>
      <h2 className="ml-20 mt-4 text-xl mb-1 text-white">Data Type</h2>
      <div className="px-20 flex gap-x-4">
        {dataType.map((type) => (
          <button
            key={type.title}
            className={`px-4 py-2 rounded-md border-2 transition-all ease-linear duration-200 ${
              currentDataType === type.title
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-neutral-50 border-slate-400 text-neutral-400"
            }`}
            onClick={() => {
              setCurrentDataType(type.title);
            }}
          >
            {type.title}
          </button>
        ))}
      </div>
      <div className="flex h-full">
        <div
          className="mt-6 w-3/5 flex flex-col gap-y-4 pl-20 pr-4 overflow-y-scroll pb-[20%]"
          id="data-storage"
        >
          {dataStorage.length > 0 &&
            Object.values(groupAndCountData(dataStorage)).map((data, index) => {
              const colorClasses = {
                red: "bg-red-600/50",
                blue: "bg-blue-600/50",
                green: "bg-green-600/50",
                orange: "bg-orange-600/50",
                yellow: "bg-yellow-600/50",
                black: "bg-black/50",
              };
              return (
                <div
                  key={`${data.element}-${data.name}-${index}`}
                  className="w-full bg-white/20 flex-grow p-3 rounded-lg border-2 flex gap-x-2
                        hover:scale-105 transition-all duration-200 ease-linear cursor-pointer hover:shadow-md 
                        hover:shadow-blue-400/100 hover:bg-cyan-400/10 hover:border-cyan-400/50"
                >
                  <div className="w-24 h-24 rounded-md border relative">
                    <div className="w-8 h-8 absolute -right-3 -top-1.5 z-10 bg-cyan-400 text-center rounded-full pt-0.5 p-1">
                      <p className="mt-0.5 font-semibold text-slate-500">
                        {data.count}
                      </p>
                    </div>
                    <div
                      className={`absolute w-full h-full ${
                        colorClasses[data.color]
                      }`}
                    ></div>
                    <img
                      className="w-full h-full p-2"
                      src={data.image_url || "/images/slime_default.png"}
                      alt={data.name}
                    />
                  </div>
                  <div className="flex flex-col justify-center ml-2">
                    <p className="text-white font-semibold">{data.name}</p>
                    <p className="text-white">Energy Source: {data.element}</p>
                    <p className="text-white">Weakness: {data.element}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="w-2/5 p-4 h-full pb-[18rem]">
          <div className="border-2 rounded-xl h-full flex">
            <div className="m-auto text-center flex flex-col gap-y-4">
              <TbBorderNone className="text-[5rem] mx-auto text-white" />
              <p className="text-xl text-white">
                No data selected, please select a data to view details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataStoragePanel;
