import { Fieldset } from "primereact/fieldset";
import { Slider } from "primereact/slider";
import { useContext, useState } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { FaPlayCircle } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import "primeflex/primeflex.css";
import { GameContext } from "../../../contexts/GameContext";
import { FaCircleXmark } from "react-icons/fa6";
import useAudio from "../../../hooks/useAudio";
import { Checkbox } from "primereact/checkbox";

const AudioInputUI = ({
  setIsOpenAudioInput,
  isPlayingSound,
  setIsPlayingSound,
  handlePlaySound
}) => {
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);

  const [volume, setVolume] = useState(50);
  const [audioFileList, setAudioFileList] = useState([
    {
      name: "Door Bell 1",
      fileType: "mp3",
      path: "/soundfx/environment/doorbell/doorbell-1",
    },
    {
      name: "Door Bell 2",
      fileType: "mp3",
      path: "/soundfx/environment/doorbell/doorbell-2",
    },
    {
      name: "Background-Music3",
      fileType: "mp3",
      path: "path/to/file3.mp3",
    },
    {
      name: "Ambient-Noise4",
      fileType: "ogg",
      path: "path/to/file4.ogg",
    },
    {
      name: "Dialog-Clip5",
      fileType: "mp3",
      path: "path/to/file5.mp3",
    },
  ]);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(null);
  const [confirmedAudioIndex, setConfirmedAudioIndex] = useState(null);
  const [isLooping, setIsLooping] = useState(false);

  // Initialize playAudio hook without calling it directly
  const selectedAudioPath =
    selectedAudioIndex !== null && audioFileList[selectedAudioIndex].fileType
      ? `${audioFileList[selectedAudioIndex].path}.${audioFileList[selectedAudioIndex].fileType}`
      : null;

  const handleSelectAudio = (index) => {
    setSelectedAudioIndex(index);
  };

  const handleActivateAudio = () => {
    handlePlaySound(selectedAudioPath,volume/100,isLooping);
  };

  const handleClose = () => {
    setIsOpenAudioInput(false);
    setCurrentHit("");
    setIsInteracting(false);
  };

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mb-20 flex">
        <Fieldset
          legend="Audio File Input"
          style={{ paddingBottom: "0" }}
          className="bg-cyan-600/50 border-2 w-full items-center justify-center rounded-3xl relative"
        >
          <div
            className="bg-white cursor-pointer text-red-600/80 hover:text-red-400 rounded-full 
            absolute z-50 -top-4 right-4 text-3xl"
            onClick={handleClose}
          >
            <FaCircleXmark className="" />
          </div>
          <div className="grid grid-cols-9 gap-x-4">
            <div className="col-span-4">
              <p className="text-xl text-white flex">
                Select Audio File{" "}
                <AiOutlineSound className="text-xl my-auto ml-2" />
              </p>
              <div className="w-full h-[17rem] p-2 bg-white/40 border-2 rounded-xl mt-2 relative">
                {/* Scrolling content wrapper */}
                <div className="flex flex-col gap-y-2 rounded-r-none pr-2 overflow-y-scroll h-full relative">
                  {audioFileList.map((audioFile, index) => (
                    <div
                      key={index}
                      className={`w-full px-1.5 py-1.5 cursor-pointer border rounded-md ${
                        selectedAudioIndex === index
                          ? "border-2 border-blue-500 bg-blue-400/50 opacity-100"
                          : "bg-orange-400/50 hover:bg-orange-300 opacity-90"
                      } ${confirmedAudioIndex === index && "bg-cyan-400/50"}`}
                      onClick={() => handleSelectAudio(index)}
                    >
                      <div className="flex">
                        <div className="p-2 border rounded-lg bg-black/20 h-fit">
                          <FaPlayCircle className="text-2xl my-auto text-cyan-400 bg-blue-500 rounded-full" />
                        </div>
                        <div className="ml-2 w-full pr-3 h-full flex">
                          <p className="text-white my-auto">
                            {audioFile.name}.{audioFile.fileType}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-5 relative">
              <p className="text-xl text-white flex mb-2">
                Adjustment{" "}
                <HiOutlineAdjustmentsHorizontal className="text-xl my-auto ml-2" />
              </p>
              <div className="bg-white/50 w-full px-2 pt-0.5 pb-1 border rounded-md">
                <p className="text-white text-lg">
                  Select:{" "}
                  {selectedAudioIndex !== null
                    ? audioFileList[selectedAudioIndex].name
                    : "No file selected"}
                </p>
                <p className="text-white text-sm">
                  File Type:{" "}
                  {selectedAudioIndex !== null
                    ? audioFileList[selectedAudioIndex].fileType
                    : "None"}
                </p>
              </div>
              <div className="bg-white/50 w-full px-2 py-2.5 border rounded-md mt-2 flex">
                <Checkbox
                  inputId="ingredient1"
                  name="pizza"
                  value={isLooping}
                  className="my-auto"
                  onChange={() => {
                    setIsLooping(!isLooping);
                  }}
                  checked={isLooping}
                />
                <p className="text-white ml-2 text-xl">Loop</p>
              </div>
              <div className="bg-white/50 w-full px-2 pt-0.5 pb-2.5 border rounded-md mt-2">
                <p className="text-white">Volume: {volume}</p>
                <Slider
                  value={volume}
                  onChange={(e) => setVolume(e.value)}
                  step={20}
                />
              </div>
              <div className="bg-white/50 w-full px-2 pt-0.5 pb-2.5 border rounded-md mt-2">
                <p className="text-white">Duration: 5</p>
                <Slider
                  value={volume}
                  onChange={(e) => setVolume(e.value)}
                  step={20}
                />
              </div>
              <div className="w-full px-2 pb-2 mt-2">
                <button
                  className="py-2 text-white rounded-lg border w-full z-[50] bg-cyan-500 -ml-2"
                  onClick={handleActivateAudio}
                >
                  Activate Audio
                </button>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
};

export default AudioInputUI;
