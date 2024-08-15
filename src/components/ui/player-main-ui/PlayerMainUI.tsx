import { useContext, useEffect, useRef, useState } from "react";
import CharacterHead from "../../create-character/cut/CharacterHead";
import { Dialog } from "primereact/dialog";
import { GameContext } from "../../../contexts/GameContext";
import { Toast } from "primereact/toast";
import * as THREE from "three";
import { useCharacterInventory } from "../../../hooks/useCharacterInventory";

const PlayerMainUI = () => {
  const {
    isUsingSearch,
    setIsHidden,
    setIsUsingSearch,
    setIsPlanting,
    cooldowns,
    setCooldowns,
    currentScene,
    energy,
    setEnergy,
    isDeath,
    searchAimDirection,
    searchResult,
    setSearchResult,
    searchDataNotify,
  } = useContext(GameContext);

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
      life_time: 8,
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

  const [progress, setProgress] = useState(0);
  // const [openInventory, setOpenInventory] = useState(false);
  const { isInventoryItemRemaining, decreaseInventoryItemQuantityByName } = useCharacterInventory();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const key = event.key.toUpperCase();
      // if (key === "I" || key === "Escape") {
      //   setOpenInventory((prevState) => !prevState); // Toggle Sidebar visibility
      //   return; // Prevent further execution if the key is "I"
      // }
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

        switch (starterItem[itemIndex].name) {
          case "stealth-cloak":
            if (isInventoryItemRemaining("Invisible suit")) {
              setIsHidden(true);
              decreaseInventoryItemQuantityByName("Invisible suit", 1);
              setTimeout(
                () => setIsHidden(false),
                starterItem[itemIndex].life_time * 1000
              );
            }
            break;
          case "data-extractor":
            if (isInventoryItemRemaining("Frantic search")) {
              setSearchResult(null);
              searchAimDirection.current = new THREE.Vector3(0, 0, -1),
                setIsUsingSearch(true);
              decreaseInventoryItemQuantityByName("Frantic search", 1);
              setTimeout(
                () => setIsUsingSearch(false),
                starterItem[itemIndex].life_time * 1000
              );
            }
            break;
          case "bomb":
            setIsPlanting(true);
            setTimeout(
              () => setIsPlanting(false),
              starterItem[itemIndex].life_time * 1000
            );
            break;
          // Add cases for other abilities and their corresponding context state updates
        }

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
    if (energy === 10) return;
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

  const aimHitEnemyToast = useRef<any>(null);
  const showToast = (severityValue, summaryValue, detailValue) => {
    aimHitEnemyToast.current.show({
      severity: severityValue,
      summary: summaryValue,
      detail: detailValue,
    });
  };

  return (
    <div
      className={`absolute bottom-0 w-full ${isDeath ? "opacity-0" : "opacity-100"} z-[9998] px-0 py-10 ${currentScene?.includes("game") || currentScene === "tutorial" ? "block" : "hidden"} ${isUsingSearch ? "h-full" : "h-fit"
        }`}
      id={isUsingSearch ? "aim-blur-active" : "air-not-inactive"}
    >
      <Toast ref={aimHitEnemyToast} />
      <Toast ref={searchDataNotify} position="top-right" />
      {isUsingSearch && (
        <>
          <div
            className={`absolute max-w-2xl h-[42rem] w-full flex justify-center items-center 
            top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5rem]
            ${searchResult !== null ? "border-green-400/50 z-[900]" : "border-cyan-400/50 z-[900]"}`}
            id={isUsingSearch ? "circle-hole-active" : "circle-hole-inactive"}
          >
            {/* {(searchResult !== null && searchResult.name) &&
              <p>{searchResult.name}</p>
            } */}
            <div className="rounded-full border-l-4 border-r-4 border-green-400/50 px-1.5 py-2 animate-spin">
              <div className="bg-red-600/50 w-10 h-10 rounded-full"></div>
            </div>
          </div>
          <div className="absolute max-w-2xl h-full w-full flex justify-center items-end z-[1000]
    top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {(searchResult !== null && searchResult.name) &&
              <div className="text-white text-center">
                <p className="text-2xl font-semibold text-green-400">Found: {searchResult.name}</p>
                {searchResult.parameter && searchResult.parameter.element && searchResult.parameter.weakness &&
                  <p className="text-xl">Element: {searchResult.parameter.element}, Weakness: {searchResult.parameter.weakness}</p>
                }
              </div>
            }
          </div>
        </>
      )}
      <div className="relative h-full">
        <div className="absolute left-10 bottom-2 w-fit">
          {/* <img src={playerImage} className="mt-[4%]" /> */}
          <div className="w-full relative">
            <div className="w-32">
              <img src="images/Profile.png" />
            </div>
            <div className="text-white absolute left-[120%] bottom-[80%] ">{energy}/10</div>
            <div className="absolute left-[120%] bottom-[20%] flex flex-col gap-y-4 bg-blue-400/50 rounded-md">
              <div className="w-[35vh] h-14 border rounded-md rounded-b-none px-1.5 py-1.5 flex gap-1 transition-all duration-100 ease-linear">
                {Array.from({ length: energy }).map((_, index) => (
                  <div className="w-[10%] h-full rounded-md bg-blue-400 transition-all duration-100 ease-linear"></div>
                ))}
              </div>
              <div
                className="h-4 bg-orange-300 -mt-4 rounded-b-lg border border-t-0  transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex absolute right-16 bottom-4 gap-x-6">
          {starterItem.map((item) => (
            <button
              key={item.name}
              className={`relative h-24 w-24 ${cooldowns[item.activate_key] > 0 ? "bg-gray-400" : "bg-white/60"
                } rounded-lg border-b-4 border-b-cyan-400 hover:bg-cyan-400/50`}
              disabled={cooldowns[item.activate_key] > 0}
            >
              <img src={item.icon} className="h-16 w-6 mx-auto mt-2 py-2" />
              <div className="absolute z-10 bg-cyan-400 rounded-xl -top-4 -right-2 w-fit px-4 py-1 border-white border-2">
                <p className="font-bold text-slate-600">{item.activate_key}</p>
              </div>
              <div className="absolute z-10 bg-cyan-400 rounded-xl -bottom-4 -left-4 w-fit px-2 py-1 border-white border-2">
                <div className="font-bold text-slate-600 flex gap-x-1">
                  <div className="w-4 h-4 bg-blue-400 rounded-md my-auto"></div>
                  <p className="text-sm">x{item.energy_cost}</p>
                </div>
              </div>
              {/* <img src={"/images/homer.png"} className="p-6 z-[10000]" /> */}
              <div
                className="absolute w-full bg-white/60 bottom-0 rounded-xl rotate-180 transition-all ease-linear duration-200"
                style={{
                  height: `${(cooldowns[item.activate_key] / item.cooldown) * 100
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
