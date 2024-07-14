import { useEffect, useState } from "react";
import playerImage from "/player-ui.gif";
import CharacterHead from "../../create-character/CharacterHead";

const PlayerMainUI = () => {
  const [starterItem, setStarterItem] = useState([
    {
      name: "stealth-cloak",
      life_time: 4,
      cooldown: 20,
      icon: "https://cdn-icons-png.flaticon.com/512/5102/5102093.png",
      active: false,
      activate_key: "J",
      energy_cost: 2,
    },
    {
      name: "data-extractor",
      life_time: 6,
      cooldown: 10,
      icon: "https://cdn-icons-png.flaticon.com/512/639/639375.png",
      active: false,
      activate_key: "K",
      energy_cost: 1,
    },
    {
      name: "bomb",
      life_time: 4,
      cooldown: 10,
      icon: "https://cdn-icons-png.flaticon.com/512/4612/4612069.png",
      active: false,
      activate_key: "L",
      energy_cost: 3,
    },
  ]);

  const [cooldowns, setCooldowns] = useState({ J: 0, K: 0, L: 0 });
  const [energy, setEnergy] = useState(10);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const itemIndex = starterItem.findIndex(
        (item) => item.activate_key === key
      );
      if (
        itemIndex !== -1 &&
        cooldowns[key] === 0 &&
        energy >= starterItem[itemIndex].energy_cost
      ) {
        // Consume energy cost
        setEnergy(
          (prevEnergy) => prevEnergy - starterItem[itemIndex].energy_cost
        );

        const newCooldowns = { ...cooldowns };
        newCooldowns[key] = starterItem[itemIndex].cooldown;
        setCooldowns(newCooldowns);

        // Start countdown for cooldown
        const intervalId = setInterval(() => {
          setCooldowns((prevCooldowns) => {
            const updatedCooldowns = { ...prevCooldowns };
            if (updatedCooldowns[key] > 0) {
              updatedCooldowns[key] -= 1;
            }
            return updatedCooldowns;
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          setCooldowns((prevCooldowns) => {
            const updatedCooldowns = { ...prevCooldowns };
            updatedCooldowns[key] = 0;
            return updatedCooldowns;
          });
        }, starterItem[itemIndex].cooldown * 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [starterItem, cooldowns, energy]);

  // Reload energy +1 every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEnergy((prevEnergy) =>
        prevEnergy < 10 ? prevEnergy + 1 : prevEnergy
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if(energy === 10) return;
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 33.33;
        if (newProgress >= 100) {
          return 0; // Reset progress if it reaches 100%
        }
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(progressInterval);
  }, [energy]);

  return (
    <div className="absolute bottom-0 w-full z-[1000] px-0 py-10 h-[30vh] hidden">
      {/* <div className="w-[17.5rem] h-[17.5rem] rounded-full absolute -left-[3.5%] -bottom-[15%]
        bg-blue-400/50 border-4 border-white">

        </div> */}
      <div className="relative h-full">
        <div className="absolute left-10 bottom-0 w-fit">
          {/* <img src={playerImage} className="mt-[4%]" /> */}
          <div className="w-full relative">
            <div className="w-28">
              <CharacterHead />
            </div>
            <div className="absolute left-[145%] bottom-[30%] flex flex-col gap-y-4 bg-blue-400/50 rounded-md">
              <div className="w-[35vh] h-14 border rounded-md rounded-b-none px-1.5 py-1.5 flex gap-1 transition-all duration-100 ease-linear">
                {Array.from({ length: energy }).map((_, index) => (
                  <div className="w-[10%] h-full rounded-md bg-blue-400 transition-all duration-100 ease-linear"></div>
                ))}
                <div className="absolute top-4 -right-14 text-white">
                  {energy}/10
                </div>
              </div>
              <div
                className="h-4 bg-orange-300 -mt-4 rounded-b-lg border border-t-0  transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex absolute right-16 bottom-0 gap-x-6">
          {starterItem.map((item) => (
            <button
              key={item.name}
              className={`relative h-24 w-24 ${
                cooldowns[item.activate_key] > 0 ? "bg-gray-400" : "bg-white/60"
              } rounded-lg border-b-4 border-b-cyan-400 hover:bg-cyan-400/50`}
              disabled={cooldowns[item.activate_key] > 0}
            >
              <div className="absolute z-10 bg-cyan-400 rounded-xl -top-4 -right-2 w-fit px-4 py-1 border-white border-2">
                <p className="font-bold text-slate-600">{item.activate_key}</p>
              </div>
              <div className="absolute z-10 bg-cyan-400 rounded-xl -bottom-4 -left-4 w-fit px-2 py-1 border-white border-2">
                <div className="font-bold text-slate-600 flex gap-x-1">
                  <div className="w-4 h-4 bg-blue-400 rounded-md my-auto"></div>
                  <p className="text-sm">x{item.energy_cost}</p>
                </div>
              </div>
              <img src={item.icon} className="p-6" />
              <div
                className="absolute w-full bg-white/80 bottom-0 rounded-xl rotate-180 transition-all ease-linear duration-200"
                style={{
                  height: `${
                    (cooldowns[item.activate_key] / item.cooldown) * 100
                  }%`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerMainUI;
