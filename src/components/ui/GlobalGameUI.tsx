import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { LiaRobotSolid } from "react-icons/lia";
import { MdCancelPresentation } from "react-icons/md";

const AskForInputKeyDown = ({ title }: { title: string }) => {
  return (
    <div className="absolute z-[100] bottom-20 left-1/2 transform -translate-x-1/2">
      <h1 className="text-white text-3xl">{title}</h1>
    </div>
  );
};

const AiModelComputer = ({ setIsCoding }) => {
  // Define an array of objects for each section
  const sections = [
    { title: "Inventory" },
    { title: "Data Storage" },
    { title: "Train AI Model" },
    { title: "AI Tools" },
    { title: "Level Info" },
  ];

  const [currentSection, setCurrentSection] = useState(sections[0]);
  const handleClose = () => {
    setIsCoding(false);
  };

  return (
    <div className="absolute w-full z-[100] flex h-screen top-0 p-16 left-1/2 transform -translate-x-1/2">
      <div className="flex-grow relative bg-cyan-400/10 border-8 border-cyan-400/20 rounded-xl px-10 pt-0 pb-8 shadow-lg shadow-white">
        <div
          className="text-center text-3xl rounded-b-2xl border-8 border-t-0 border-cyan-400/40 mb-6 pt-5 pb-4 
          px-6  w-fit mx-auto bg-cyan-600/10 text-white font-semibold tracking-wider"
        >
          Intelligence Computer
        </div>
        <MdCancelPresentation
          className="absolute top-3 right-3 text-[3rem] text-red-600/80 cursor-pointer"
          onClick={handleClose}
        />

        <div className="flex gap-x-6">
          {sections.map((section) => (
            <button
              key={section.title}
              className={`px-6 py-4 text-xl border rounded-lg ${
                currentSection.title === section.title
                  ? "bg-cyan-400/20 hover: text-white font-semibold"
                  : "text-slate-200 bg-white/20 "
              }
                  hover:bg-cyan-400/20 transition-all duration-200 ease-linear hover:shadow-md hover:shadow-blue-400`}
              onClick={() => {
                setCurrentSection(section);
              }}
            >
              <div className="flex gap-x-2">
                <LiaRobotSolid className="my-auto text-2xl" />{" "}
                <p>{section.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const GlobalGameUI = () => {
  const { currentHit, setCurrentHit, isCoding, setIsCoding,isInteracting, setIsInteracting } =
    useContext(GameContext);
  return (
    <>
      {currentHit === "computer" &&
        (isCoding ? (
          <AskForInputKeyDown title="Press E to Leave Computer" />
        ) : (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ))}
      {currentHit === "assistant-bot" &&
        (isInteracting ? (
          <AskForInputKeyDown title="Press E to Leave Assistant Bot" />
        ) : (
          <AskForInputKeyDown title="Press E to Interact with Assistant Bot" />
        ))}

      {isCoding && <AiModelComputer setIsCoding={setIsCoding} />}
    </>
  );
};
export default GlobalGameUI;
