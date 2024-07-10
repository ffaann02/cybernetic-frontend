import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { LiaRobotSolid } from "react-icons/lia";
import { MdCancelPresentation } from "react-icons/md";
import PlayerMainUI from "./main-ui/PlayerMainUI";
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
    <div className="absolute w-full z-[1000] flex h-screen top-0 p-16 left-1/2 transform -translate-x-1/2">
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

// const PlayerMainUI = () => {
//   const [starterItem, setStarterItem] = useState([
//     {
//       name: "stealth-cloak",
//       life_time: 4,
//       cooldown: 20,
//       icon: "https://cdn-icons-png.flaticon.com/512/5102/5102093.png",
//       active: false,
//       activate_key: "J",
//       energy_cost: 2,
//     },
//     {
//       name: "data-extractor",
//       life_time: 6,
//       cooldown: 10,
//       icon: "https://cdn-icons-png.flaticon.com/512/639/639375.png",
//       active: false,
//       activate_key: "K",
//       energy_cost: 1,
//     },
//     {
//       name: "bomb",
//       life_time: 4,
//       cooldown: 10,
//       icon: "https://cdn-icons-png.flaticon.com/512/4612/4612069.png",
//       active: false,
//       activate_key: "L",
//       energy_cost: 3,
//     },
//   ]);

//   const [cooldowns, setCooldowns] = useState({ J: 0, K: 0, L: 0 });
//   const [energy, setEnergy] = useState(10);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toUpperCase();
//       const itemIndex = starterItem.findIndex((item) => item.activate_key === key);
//       if (itemIndex !== -1 && cooldowns[key] === 0 && energy >= starterItem[itemIndex].energy_cost) {
//         // Consume energy cost
//         setEnergy((prevEnergy) => prevEnergy - starterItem[itemIndex].energy_cost);
  
//         const newCooldowns = { ...cooldowns };
//         newCooldowns[key] = starterItem[itemIndex].cooldown;
//         setCooldowns(newCooldowns);
  
//         // Start countdown for cooldown
//         const intervalId = setInterval(() => {
//           setCooldowns((prevCooldowns) => {
//             const updatedCooldowns = { ...prevCooldowns };
//             if (updatedCooldowns[key] > 0) {
//               updatedCooldowns[key] -= 1;
//             }
//             return updatedCooldowns;
//           });
//         }, 1000);
  
//         setTimeout(() => {
//           clearInterval(intervalId);
//           setCooldowns((prevCooldowns) => {
//             const updatedCooldowns = { ...prevCooldowns };
//             updatedCooldowns[key] = 0;
//             return updatedCooldowns;
//           });
//         }, starterItem[itemIndex].cooldown * 1000);
//       }
//     };
  
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [starterItem, cooldowns, energy]);
  
//   // Reload energy +1 every 3 seconds
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setEnergy((prevEnergy) => (prevEnergy < 10 ? prevEnergy + 1 : prevEnergy));
//     }, 3000);
  
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="absolute bottom-0 w-full z-[1000] px-0 py-10 h-[30vh]">
//       <div className="relative h-full">
//         <div className="absolute left-0 top-0">
//           <img src={playerImage} className="mt-[4%]" />
//           <div className="absolute -right-44 bottom-[60%] flex flex-col gap-y-4 bg-blue-400/50 rounded-md">
//             <div className="w-[30vh] h-10 border rounded-md px-1.5 py-1.5 flex gap-1 transition-all duration-100 ease-linear">
//               {Array.from({ length: energy }).map((_, index) => (
//                 <div className="w-[10%] h-full rounded-md bg-blue-400 transition-all duration-100 ease-linear"></div>
//               ))}
//               <div className="absolute top-2.5 -right-14 text-white">
//                 {energy}/10
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex absolute right-16 bottom-0 gap-x-6">
//           {starterItem.map((item) => (
//             <button
//               key={item.name}
//               className={`relative h-24 w-24 ${
//                 cooldowns[item.activate_key] > 0 ? "bg-gray-400" : "bg-white/60"
//               } rounded-lg border-b-4 border-b-cyan-400 hover:bg-cyan-400/50`}
//               disabled={cooldowns[item.activate_key] > 0}
//             >
//               <div className="absolute z-10 bg-cyan-400 rounded-xl -top-4 -right-2 w-fit px-4 py-1 border-white border-2">
//                 <p className="font-bold text-slate-600">{item.activate_key}</p>
//               </div>
//               <div className="absolute z-10 bg-cyan-400 rounded-xl -bottom-4 -left-4 w-fit px-2 py-1 border-white border-2">
//                 <div className="font-bold text-slate-600 flex gap-x-1">
//                   <div className="w-4 h-4 bg-blue-400 rounded-md my-auto"></div>
//                   <p className="text-sm">x{item.energy_cost}</p>
//                 </div>
//               </div>
//               <img src={item.icon} className="p-6" />
//               <div
//                 className="absolute w-full bg-white/80 bottom-0 rounded-xl rotate-180 transition-all ease-linear duration-200"
//                 style={{
//                   height: `${
//                     (cooldowns[item.activate_key] / item.cooldown) * 100
//                   }%`,
//                 }}
//               />
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const GlobalGameUI = () => {
  const {
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding,
    isInteracting,
    setIsInteracting,
  } = useContext(GameContext);
  return (
    <>
      {/* <PlayerMainUI /> */}
      <PlayerMainUI/>
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
