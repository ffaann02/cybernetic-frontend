import { useState } from "react";
import { TbBorderNone } from "react-icons/tb";
import { MdBatteryCharging90 } from "react-icons/md";
import { LuShieldClose } from "react-icons/lu";
import { Divider } from "primereact/divider";

const DataStoragePanel = ({
  dataStorage,
  setDataStorage,
  dataType,
  currentDataType,
  setCurrentDataType,
  groupAndCountData,
}) => {
  const [selectedData, setSelectedData] = useState(null);

  const colorClasses = {
    red: "bg-red-600/50",
    blue: "bg-blue-600/50",
    green: "bg-green-600/50",
    orange: "bg-orange-600/50",
    yellow: "bg-yellow-600/50",
    black: "bg-black/50",
  };

  const renderProperties = (data) => {
    return Object.entries(data).map(([key, value]) => {
      if (
        key !== "image_url" &&
        key !== "name" &&
        key !== "element" &&
        key !== "weakness" &&
        key !== "color"
      ) {
        return (
          <div
            key={key}
            className="col-span-3 text-white text-left flex gap-x-1 px-2.5 py-2 bg-cyan-600/50 border border-slate-400/50 rounded-lg"
          >
            <span className="font-semibold capitalize">
              {key.replace(/_/g, " ")}:
            </span>{" "}
            <span>{value}</span>
          </div>
        );
      }
      return null;
    });
  };

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
              return (
                <div
                  key={`${data.element}-${data.name}-${index}`}
                  className={`w-full ${
                    selectedData && 
                    selectedData.name + selectedData.element ===
                    data.name + data.element ? "bg-cyan-400/50 border-4":"bg-white/20 border-2 opacity-75 hover:scale-105 hover:shadow-blue-400/100 hover:bg-cyan-400/10 hover:border-cyan-400/50"
                  } flex-grow p-3 rounded-lg flex gap-x-2
                         transition-all duration-200 ease-linear cursor-pointer hover:shadow-md 
                        `}
                  onClick={() => setSelectedData(data)}
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
                    <p className="text-white">Weakness: {data.weakness}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="w-2/5 p-4 h-full pb-[18rem]">
          <div className="border-2 rounded-xl h-full flex">
            {selectedData ? (
              <div className="p-4 w-full text-center flex flex-col gap-y-4 overflow-y-auto">
                <div className="w-full">
                  <div className="flex w-full">
                    <div className="relative w-36 h-36 rounded-xl border bg-white/20">
                      <div
                        className={`absolute w-full h-full rounded-xl ${
                          colorClasses[selectedData.color]
                        }`}
                      ></div>
                      <img
                        className="m-auto w-full h-full object-cover"
                        src={
                          selectedData.image_url || "/images/slime_default.png"
                        }
                        alt={selectedData.name}
                      />
                    </div>
                    <div className="text-left ml-4 mt-1">
                      <p className="text-2xl text-white font-semibold">
                        {selectedData.name.split(" - ")[0]}
                      </p>
                      <div className="text-white flex gap-x-1 mt-1 px-2.5 py-2 bg-cyan-600/50 border border-slate-400/50 rounded-lg">
                        <MdBatteryCharging90 className="my-auto text-3xl -ml-2 -mt-1" />
                        <span className="">
                          Energy Source:{" "}
                          {selectedData.element.charAt(0).toUpperCase() +
                            selectedData.element.slice(1)}
                        </span>
                      </div>
                      <div className="text-white flex gap-x-1 mt-3 px-2.5 py-2 bg-cyan-600/50 border border-slate-400/50 rounded-lg">
                        <LuShieldClose className="my-auto text-3xl -ml-2 -mt-1" />
                        <span className="">
                          Weakness:{" "}
                          {selectedData.weakness.charAt(0).toUpperCase() +
                            selectedData.weakness.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-left text-xl text-white -mb-2">
                  Data Profile
                </h4>
                <Divider />
                <div className="grid grid-cols-9 gap-3">
                  {renderProperties(selectedData)}
                </div>
              </div>
            ) : (
              <div className="m-auto text-center flex flex-col gap-y-4">
                <TbBorderNone className="text-[5rem] mx-auto text-white" />
                <p className="text-xl text-white">
                  No data selected, please select a data to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DataStoragePanel;
