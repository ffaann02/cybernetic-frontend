import { useState, useContext } from "react";
import { IoPlayOutline } from "react-icons/io5";
import { GameContext } from "../../../contexts/GameContext";
import "primeflex/primeflex.css";

const CDStorageUI = ({ isOpenCD, setIsOpenCD }) => {
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);

  const handleActivateAudio = () => {
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenCD(false);
  };

  const handleClose = () => {
    setIsOpenCD(false);
    setCurrentHit("");
    setIsInteracting(false);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const audioTracks = [
    { description: "Doorbell ringing", recordedBy: "User A", imageUrl: "https://cdn-icons-png.flaticon.com/512/3106/3106703.png" },
    { description: "Dog barking", recordedBy: "User B", imageUrl: "https://cdn-icons-png.flaticon.com/512/3106/3106703.png" },
    { description: "Rain falling", recordedBy: "User C", imageUrl: "https://cdn-icons-png.flaticon.com/512/3106/3106703.png" },
    { description: "Doorbell ringing", recordedBy: "User D", imageUrl: "https://cdn-icons-png.flaticon.com/512/3106/3106703.png" },
    { description: "Dog barking", recordedBy: "User E", imageUrl: "https://cdn-icons-png.flaticon.com/512/3106/3106703.png" },
  ];

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div className="max-w-3xl w-full mb-20 relative">
        <button
          className="text-white bg-red-400/50 absolute right-4 top-4 z-[120] border-red-600 
            border px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 ease-linear"
          onClick={handleClose}
        >
          Close
        </button>
        <div className="bg-white/50 w-full border-2 rounded-xl h-full">
          <div className="w-full sticky top-0 z-[50] rounded-t-xl pt-4 h-fit px-3 pb-3 bg-cyan-600/90 flex gap-x-6">
            <div
              className={`${
                activeIndex === 0
                  ? "text-white underline underline-offset-2"
                  : "text-white/50"
              } text-xl cursor-pointer`}
              onClick={() => {
                setActiveIndex(0);
              }}
            >
              All Track
            </div>
            <div
              className={`${
                activeIndex === 1
                  ? "text-white underline underline-offset-2"
                  : "text-white/50"
              } text-xl cursor-pointer`}
              onClick={() => {
                setActiveIndex(1);
              }}
            >
              Labeled
            </div>
          </div>
          <div className="w-full h-full grid grid-cols-5 ml-[0.5px] mt-2">
            <div className="col-span-full flex flex-col gap-y-2 px-2 overflow-y-auto h-full">
              {audioTracks.map((track, index) => (
                <div
                  key={index}
                  className="w-full flex justify-between bg-cyan-400/50 rounded-lg border px-1 py-1 hover:bg-cyan-500/50 cursor-pointer"
                >
                  <div className="flex">
                    <img
                      src={track.imageUrl}
                      className="w-[40px] h-[40px] ml-1 my-auto bg-neutral-50 rounded-full"
                    />
                    <div className="ml-2">
                      <p className="font-semibold text-lg text-slate-600">
                        Unknown Audio Track
                      </p>
                      <p className="font-semibold text-sm text-white -mt-1">
                        {track.description}
                      </p>
                      <p className="font-semibold text-sm text-white -mt-1">
                        Recorded By {track.recordedBy}
                      </p>
                    </div>
                  </div>
                  <div className="border-2 px-2 h-fit py-2 rounded-full flex my-auto mr-1">
                    <IoPlayOutline className="text-xl font-bold text-white my-auto ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDStorageUI;
