import { Fieldset } from "primereact/fieldset";
import { Slider } from "primereact/slider";
import { useContext, useState } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { FaPlayCircle } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import "primeflex/primeflex.css";
import { GameContext } from "../../../contexts/GameContext";
import { TabPanel, TabView } from "primereact/tabview";
import { FaCircleXmark } from "react-icons/fa6";
import ReactPlayer from "react-player";

const VideoFootageUI = ({ isOpenVideoFootage, setIsOpenVideoFootage }) => {
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);

  const handleActivateAudio = () => {
    setCurrentHit("");
    setIsInteracting(false);
    setIsOpenVideoFootage(false);
  };

  const handleClose = () => {
    setIsOpenVideoFootage(false);
    setCurrentHit("");
    setIsInteracting(false);
  }

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div className="max-w-3xl w-full mb-20 flex relative">
        {/* <div
          className="bg-white cursor-pointer text-red-600 hover:text-red-400 rounded-full 
            absolute z-50 top-10 right-4 text-2xl"
        >
          <FaCircleXmark className="" />
        </div> */}
        <Fieldset
          legend="Video Footage"
          style={{ paddingBottom: "0" }}
          className="bg-cyan-600/50 border-2 w-full items-center justify-center rounded-3xl relative"
        >
          <button className="text-red-600 absolute right-8 top-[1.9rem] z-[50] border-red-600 
            border px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 ease-linear"
              onClick={handleClose}>Close</button>
          <TabView
            activeIndex={0}
            style={{
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
            }}
          >
            <TabPanel header="Video 1">
              <ReactPlayer
                playing={true}
                url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                  padding: "10px",
                  justifyContent: "center",
                  margin: "auto",
                  borderRadius: "20px",
                  boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.4)",
                }}
              />
            </TabPanel>
            <TabPanel header="Video 2">
              <ReactPlayer
                playing={true}
                url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                  padding: "10px",
                  justifyContent: "center",
                  margin: "auto",
                  borderRadius: "20px",
                  boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.4)",
                }}
              />
            </TabPanel>
          </TabView>
        </Fieldset>
      </div>
    </div>
  );
};

export default VideoFootageUI;
