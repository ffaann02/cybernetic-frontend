import { Fieldset } from "primereact/fieldset";
import { MeterGroup } from "primereact/metergroup";
import { useContext, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { GameContext } from "../../../contexts/GameContext";
import { label } from "three/examples/jsm/nodes/Nodes.js";
import { vec3 } from "@react-three/rapier";

const GuardDataPanelUI = ({
  showDialog,
  setShowDialog,
  // values,
  // inputValues,
  preparedImages,
  selectedIndices,
  toggleSelection,
  imageCollectedList,
  textCollectedList,
  audioCollectedList,
  objectCollectedList,
  numericalCollectedList,
  maxImageCollected,
  maxAudioCollected,
  maxTextCollected,
  maxObjectCollected,
  maxNumericalCollected,
  isSourceFull,
  setIsSourceFull,
  collectedFullNotify,
  setIsSubmitClicked,
}) => {

  const { setIsInteracting } = useContext(GameContext);

  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState([]);
  const [selectedText, setSelectedText] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);
  const [selectedNumerical, setSelectedNumerical] = useState([]);

  const maxAllCollected = maxImageCollected + maxAudioCollected + maxTextCollected + maxObjectCollected + maxNumericalCollected;
  const multipleScale = 100 / maxAllCollected

  const [isCraneMoving, setIsCraneMoving] = useState(false);

  const values = [
    {
      label: "Image",
      value: imageCollectedList.length * multipleScale,
      color: "#4ade80",
    },
    {
      label: "Audio",
      value: audioCollectedList.length * multipleScale,
      color: "#fb923c",
    },
    {
      label: "Text",
      value: textCollectedList.length * multipleScale,
      color: "#22d3ee",
    },
    {
      label: "Object",
      value: objectCollectedList.length * multipleScale,
      color: "#94a3b8",
    },
    {
      label: "Numerical",
      value: numericalCollectedList.length * multipleScale,
      color: "#f87171",
    },
  ]

  // console.log("maxImageCollected", maxImageCollected * multipleScale);
  // console.log("maxAudioCollected", maxAudioCollected * multipleScale);
  // console.log("maxTextCollected", maxTextCollected * multipleScale);
  // console.log("maxObjectCollected", maxObjectCollected * multipleScale);
  // console.log("maxNumericalCollected", maxNumericalCollected * multipleScale);
  // const sumMaxScale = maxImageCollected * multipleScale + maxAudioCollected * multipleScale + maxTextCollected * multipleScale + maxObjectCollected * multipleScale + maxNumericalCollected * multipleScale;
  // console.log("sumMaxScale", sumMaxScale);

  const toggleCollectedSelection = (index, label) => {
    if (label === "image") {
      if (selectedImage.includes(index)) {
        setSelectedImage(selectedImage.filter(item => item !== index));
      } else {
        if (selectedImage.length < maxImageCollected) {
          setSelectedImage([...selectedImage, index]);
        }
      }
    } else if (label === "audio") {
      if (selectedAudio.includes(index)) {
        setSelectedAudio(selectedAudio.filter(item => item !== index));
      } else {
        if (selectedAudio.length < maxAudioCollected) {
          setSelectedAudio([...selectedAudio, index]);
        }
      }
    }
    else if (label === "text") {
      if (selectedText.includes(index)) {
        setSelectedText(selectedText.filter(item => item !== index));
      } else {
        if (selectedText.length < maxTextCollected) {
          setSelectedText([...selectedText, index]);
        }
      }
    }
    else if (label === "object") {
      if (selectedObject.includes(index)) {
        setSelectedObject(selectedObject.filter(item => item !== index));
      } else {
        if (selectedObject.length < maxObjectCollected) {
          setSelectedObject([...selectedObject, index]);
        }
      }
    }
    else if (label === "numerical") {
      if (selectedNumerical.includes(index)) {
        setSelectedNumerical(selectedNumerical.filter(item => item !== index));
      } else {
        if (selectedNumerical.length < maxNumericalCollected) {
          setSelectedNumerical([...selectedNumerical, index]);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedImage.length + selectedAudio.length + selectedText.length + selectedObject.length + selectedNumerical.length === maxAllCollected) {
      setIsSourceFull(true);
    } else {
      setIsSourceFull(false);
    }
  }, [selectedImage, selectedAudio, selectedText, selectedObject, selectedNumerical]);

  const moveCraneRedBox = () => {
    if (isSourceFull) {
      setIsSubmitClicked(true);
    }
    else {
      setIsSubmitClicked(false);
    }
  }

  return (
    <div
      className={`bg-black/70 h-full w-full fixed bottom-0 z-[10000] ${showDialog ? "flex" : "hidden"
        } justify-center items-center`}
    >
      <div className="flex max-w-4xl gap-x-4 relative">
        <div className="w-[50%] -left-[40%] -bottom-[25%] h-fit absolute -z-0">
          <img
            className="w-full p-2 rounded-full"
            src="/images/guard-profile.png"
          />
        </div>
        <div>
          <Fieldset
            legend="Robot Guard"
            className="-ml-2 z-[20] relative px-2 mt-4 min-w-80 bg-cyan-400/50 rounded-xl border-4 border-white shadow-lg shadow-white"
          >
            <div className="text-white">
              <h2 className="text-xl">
                I'm an elevator controller robot. If you want to go up, please
                give me the data source as a token. I will check if you have the
                right token to go up.
              </h2>
              <div className="grid grid-cols-6 mt-2">
                <div className="h-80 col-span-2 p-2 relative">
                  <div className="absolute h-[80%] bottom-0 w-1 py-2 flex flex-col-reverse" id="meter-container">
                    <div className="bg-green-400 h-[26.31%]"></div>
                    <div className="bg-orange-400 h-[26.31%]"></div>
                    <div className="bg-cyan-400 h-[15.78%]"></div>
                    <div className="bg-slate-400 h-[21.05%]"></div>
                    <div className="bg-red-400 h-[10.52%]"></div>
                  </div>

                  <div className="border-2 h-[20%] w-[50%] mx-auto rounded-t-xl border-b-0 -mb-0.5">
                    <button
                      className={`w-full h-full rounded-lg bg-green-500/90  flex gap-x-2 items-center justify-center ${isSourceFull ? "hover:bg-green-500/70" : "bg-transparent  cursor-not-allowed"}`}
                      disabled={!isSourceFull}
                      onClick={() => moveCraneRedBox()}
                    >
                      <span className={`${isSourceFull ? "text-white" : "text-slate-400"}`}>Go up</span>
                    </button>
                  </div>
                  <div className="border-2 h-[80%] w-[75%] mx-auto rounded-xl relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-[100%] rounded-b-xl flex flex-col-reverse ">
                      <div className="transition-all duration-200 ease-linear" style={{ height: `${selectedImage.length * multipleScale}%`, backgroundColor: '#4ade80' }}></div>
                      <div className="transition-all duration-200 ease-linear" style={{ height: `${selectedAudio.length * multipleScale}%`, backgroundColor: '#fb923c' }}></div>
                      <div className="transition-all duration-200 ease-linear" style={{ height: `${selectedText.length * multipleScale}%`, backgroundColor: '#22d3ee' }}></div>
                      <div className="transition-all duration-200 ease-linear" style={{ height: `${selectedObject.length * multipleScale}%`, backgroundColor: '#94a3b8' }}></div>
                      <div className="transition-all duration-200 ease-linear" style={{ height: `${selectedNumerical.length * multipleScale}%`, backgroundColor: '#f87171' }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col p-4">
                  <div className="w-full bg-white/50 rounded-xl rounded-r-none border-2 overflow-y-scroll h-60 grid grid-cols-6 gap-2 p-2">

                    {imageCollectedList && imageCollectedList.map((item, index) => (
                      <div
                        key={index}
                        className={`h-20 rounded-xl flex justify-center items-center ${selectedImage.includes(index) ? "border-green-600 border-2 bg-green-400/75" : "border-2 opacity-25 bg-green-400"}`}
                        onClick={() => toggleCollectedSelection(index, "image")}
                      >
                        <img src={"https://cdn-icons-png.flaticon.com/512/3342/3342137.png"} className="w-full h-full p-2" />
                      </div>
                    ))}

                    {audioCollectedList && audioCollectedList.map((item, index) => (
                      <div
                        key={index}
                        className={`h-20 rounded-xl flex justify-center items-center ${selectedAudio.includes(index) ? "border-orange-400 border-2 bg-orange-400/75" : "border-2 opacity-25 bg-orange-400"}`}
                        onClick={() => toggleCollectedSelection(index, "audio")}
                      >
                        <img src={"https://cdn-icons-png.flaticon.com/512/4930/4930005.png"} className="w-full h-full p-2" />
                      </div>
                    ))}

                    {textCollectedList && textCollectedList.map((item, index) => (
                      <div
                        key={index}
                        className={`h-20 rounded-xl flex justify-center items-center ${selectedText.includes(index) ? "border-cyan-600 border-2 bg-cyan-400/75" : "border-2 opacity-25 bg-cyan-400"}`}
                        onClick={() => toggleCollectedSelection(index, "text")}
                      >
                        <img src={"https://cdn-icons-png.flaticon.com/512/3721/3721901.png"} className="w-full h-full p-2" />
                      </div>
                    ))}

                    {objectCollectedList && objectCollectedList.map((item, index) => (
                      <div
                        key={index}
                        className={`h-20 rounded-xl flex justify-center items-center ${selectedObject.includes(index) ? "border-gray-600 border-2 bg-gray-400/75" : "border-2 opacity-25 bg-gray-400"}`}
                        onClick={() => toggleCollectedSelection(index, "object")}
                      >
                        <img src={"https://cdn-icons-png.flaticon.com/512/8654/8654854.png"} className="w-full h-full p-2" />
                      </div>
                    ))}


                    {numericalCollectedList && numericalCollectedList.map((item, index) => (
                      <div
                        key={index}
                        className={`h-20 rounded-xl flex justify-center items-center ${selectedNumerical.includes(index) ? "border-red-600 border-2 bg-red-400/75" : "border-2 opacity-25 bg-red-400"}`}
                        onClick={() => toggleCollectedSelection(index, "numerical")}
                      >
                        <img src={"https://cdn-icons-png.flaticon.com/512/4340/4340081.png"} className="w-full h-full p-2" />
                      </div>
                    ))}

                  </div>
                </div>
              </div>
              <div className="px-10">
                <div className="border px-3 py-1 rounded-lg bg-white/20">
                  <p>Your Token</p>
                  <MeterGroup values={values} />
                </div>
              </div>
            </div>
          </Fieldset>
          <div className="absolute top-14 right-3 z-50 text-sm">
            <button
              className="px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-500/70 flex gap-x-2 items-center"
              onClick={() => {
                setShowDialog(false);
                setIsInteracting(false);
              }}
            >
              <MdCancel className="textes-white text-xl" />
              <span className="text-white">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuardDataPanelUI;
