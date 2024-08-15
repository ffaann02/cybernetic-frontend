import { useContext, useEffect, useState } from "react";
import { GameContext, InventoryData } from "../../contexts/GameContext";
import PlayerMainUI from "./player-main-ui/PlayerMainUI";
import TrainAiComputer from "./computer/train-ai-computer/TrainAiComputer";
import { MdOutlineReplay } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { CiStar } from "react-icons/ci";
import { IoGameController, IoSettingsOutline } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import { LuPlayCircle } from "react-icons/lu";
import { TiCloudStorage, TiHomeOutline } from "react-icons/ti";
import { FaRegClock } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi";
import { PiTrophy } from "react-icons/pi";
import { GrLinkNext } from "react-icons/gr";
import { LiaBrainSolid } from "react-icons/lia";
import useAxios from "../../hooks/useAxios";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import axiosInstance from "../../api/axios";

const AskForInputKeyDown = ({ title }: { title: string }) => {
  return (
    <div className="absolute z-[100] bottom-40 left-1/2 transform -translate-x-1/2">
      <h1 className="text-white text-3xl">{title}</h1>
    </div>
  );
};

const AskForInputKeyDownSecondary = ({ title }: { title: string }) => {
  return (
    <div className="absolute z-[100] bottom-60 left-1/2 transform -translate-x-1/2">
      <h1 className="text-white text-2xl">{title}</h1>
    </div>
  );
};

const GlobalGameUI = () => {
  const { axiosFetch } = useAxios();
  const { getItem } = useLocalStorage();
  const localStorageUser = getItem("CYBERNETIC_USER");
  const userId = localStorageUser?.userId;

  const [showDeathContainer, setShowDeathContainer] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [showEnemySplash, setShowEnemySplash] = useState(false);
  const location = useLocation();

  const {
    currentHit,
    isCoding,
    isInteracting,
    isFadingBetweenRoom,
    isUsingSecurityCamera,
    isCarryingObject,
    isDeath,
    currentScene,
    setScene,
    showStar,
    isEnemyHit,
    enemyHitName,
    setIsEnemyHit,
    setEnemyHitName,
    isPaused,
    setIsPaused,
    isShowLevelResult,
    setIsShowLevelResult,
    setEnergy,
    isOpenInventory,
    inventoryItem,
    inventoryType,
    inventoryData,
    playTimeInLevel,
  } = useContext(GameContext);

  // State for Inventory Hover
  const [hoveredItem, setHoveredItem] = useState<InventoryData | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [currentInventoryType, setCurrentInventoryType] =
    useState<string>("item");

  useEffect(() => {
    if (isDeath) {
      setShowDeathContainer(true);
      const timer = setTimeout(() => {
        setShowDeathContainer(false);
        setShowPlayAgain(true);
      }, 5000); // 5 seconds

      // Cleanup the timer if the component unmounts or isDeath changes
      return () => clearTimeout(timer);
    }
  }, [isDeath]);

  useEffect(() => {
    if (isEnemyHit) {
      console.log("Enemy Hit");
      console.log(enemyHitName);
      setShowEnemySplash(true);
      const timer = setTimeout(() => {
        console.log("Enemy Hit Splash Removed");
        setShowEnemySplash(false);
        setIsEnemyHit(false);
        setEnemyHitName("");
      }, 1000); // 2 seconds

      // Cleanup the timer if the component unmounts or isEnemyHit changes
      return () => clearTimeout(timer);
    }
  }, [isEnemyHit, enemyHitName]);

  const handlePlayAgain = () => {
    // console.log("TEST");
    // console.log(currentScene);
    setScene("home", currentScene);
    setIsPaused(false);
    setIsShowLevelResult(false);
    setEnergy(10);
  };

  const handleBackToHome = () => {
    setScene(currentScene, "home");
    setIsPaused(false);
    setIsShowLevelResult(false);
  };

  const handleSetting = () => {
    setScene(currentScene, "home");
    setIsPaused(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsShowLevelResult(false);
  };

  const handlePlayNextLevel = async () => {
    const match = currentScene.match(/game-level-(\d+)/);
    const levelNumber = match ? match[1] : null;

    console.log(levelNumber); // Output: 3
    setScene(currentScene, `game-level-${parseInt(levelNumber) + 1}`);
    setIsPaused(false);
    setIsShowLevelResult(false);

    try {
      const updatedLevel = parseInt(levelNumber) + 1;
      const response = await axiosFetch({
        axiosInstance: axiosInstance,
        url: "/user/character/update/level",
        method: "post",
        requestConfig: {
          userId: userId,
          heighestLevel: updatedLevel,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse hover on item
  const handleMouseEnter = (item: InventoryData) => {
    setHoveredItem(item);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handlePlayerRespawn = async () => {
    window.location.reload();
  };

  return (
    <>
      {isOpenInventory && (
        <>
          <div
            className="absolute z-[99999] w-full h-screen bg-black/70 flex justify-center items-center"
            onMouseMove={handleMouseMove}
          >
            <div className="bg-cyan-400/50 border border-gray-500 rounded-2xl">
              <div className="pt-4 text-center">
                <span className="ml-4 text-white text-xl">Inventory</span>
              </div>
              <div className="pt-2 pb-2 ml-4 flex gap-2 justify-start">
                {inventoryType.map((item, idx) => (
                  <div key={idx}>
                    <button
                      className={`border rounded-md px-4 py-1 
                        ${
                          item.value === currentInventoryType
                            ? "bg-black/20 border-slate-400 text-slate-400"
                            : "border-white text-white"
                        }
                        `}
                      onClick={() => setCurrentInventoryType(item.value)}
                      disabled={item.value === currentInventoryType}
                    >
                      <span>{item.name}</span>
                    </button>
                  </div>
                ))}
              </div>
              {currentInventoryType === "item" && (
                <div className="px-5 pt-2 pb-5 grid grid-cols-9 gap-2">
                  {inventoryItem.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 border border-white rounded-md flex justify-center items-center hover:bg-white/50"
                      onMouseEnter={() => item && handleMouseEnter(item)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                          />
                          <span className="absolute bottom-1 right-1 text-xs text-white bg-cyan-800 px-1 rounded">
                            x{item.quantity}
                          </span>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {currentInventoryType === "data" && (
                <div className="px-5 pt-2 pb-5 grid grid-cols-9 gap-2">
                  {inventoryData.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 border border-white rounded-md flex justify-center items-center hover:bg-white/50"
                      onMouseEnter={() => item && handleMouseEnter(item)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                          />
                          <span className="absolute bottom-1 right-1 text-xs text-white bg-cyan-800 px-1 rounded">
                            x{item.quantity}
                          </span>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Tooltip that follows the mouse cursor */}
            {hoveredItem && (
              <div
                className="absolute bg-black text-white p-2 rounded shadow-md"
                style={{
                  top: mousePosition.y + 15,
                  left: mousePosition.x + 15,
                  pointerEvents: "none", // Disable pointer events so it doesn't interfere with hovering
                }}
              >
                <p className="font-bold">{hoveredItem.name}</p>
                <p className="text-xs">Quantity: {hoveredItem.quantity}</p>
                {currentInventoryType === "data" && (
                  <>
                    {hoveredItem.data.element && hoveredItem.data.weakness && (
                      <>
                        <p className="text-xs">
                          Element: {hoveredItem.data.weakness}
                        </p>
                        <p className="text-xs">
                          Weakness: {hoveredItem.data.element}
                        </p>
                      </>
                    )}
                  </>
                )}
                {currentInventoryType === "item" && (
                  <>
                    {hoveredItem.data && hoveredItem.data.description && (
                      <>
                        <p className="text-xs">
                          {hoveredItem.data.description}
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {isPaused && (
        <div className="absolute z-[99999] w-full h-screen bg-black/70 mx-auto flex">
          <div className="max-w-2xl w-full h-fit bg-cyan-400/50 m-auto border rounded-2xl pb-10">
            <div className="px-20 mt-6">
              <img src="/images/Logo_V1.png" />
            </div>
            <div className="px-10 grid grid-cols-3 mt-10 gap-x-4">
              <div
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
                onClick={handlePlayAgain}
              >
                <VscDebugRestart className="text-5xl" />
                <p className="text-2xl my-auto ml-3 whitespace-nowrap">
                  Play Again
                </p>
              </div>
              <div
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
                onClick={handleBackToHome}
              >
                <TiHomeOutline className="text-5xl" />
                <p className="text-2xl my-auto ml-3">Home</p>
              </div>
              <div
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
              >
                <IoSettingsOutline className="text-5xl" />
                <p className="text-2xl my-auto ml-3">Setting</p>
              </div>
            </div>
            <div className="w-full flex justify-center mt-3 px-10">
              <button
                // onClick={handleSelectStoryMode}
                onClick={handleResume}
                className="text-4xl bg-cyan-400/50 w-full px-4 py-3 rounded-xl font-semibold text-cyan-200 border-2 border-cyan-200
    hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear flex items-center justify-center"
              >
                <LuPlayCircle className="text-5xl mr-2" />
                RESUME
              </button>
            </div>
          </div>
        </div>
      )}

      {isShowLevelResult && (
        <div className="absolute z-[99999] w-full h-screen bg-black/70 mx-auto flex">
          <div className="max-w-2xl w-full h-fit bg-cyan-400/50 m-auto border rounded-2xl pb-4">
            {/* <div className="px-20 mt-6">
              <img src="/images/Logo_V1.png" />
            </div> */}
            <div className="px-10 pt-3">
              <p className="text-3xl text-white text-center flex mx-auto justify-center gap-x-2 mb-2">
                <HiOutlineStar className="text-5xl" />
                <span className="my-auto">SCORE</span>
              </p>
              <div className="flex w-full justify-between px-3 py-2 border rounded-lg bg-blue-400/20">
                <div>
                  <p className="text-2xl text-white text-left">TOTAL SCORE</p>
                  <p className="text-5xl text-white text-left">1,029</p>
                </div>
              </div>
              <p className="text-3xl text-white text-center flex mx-auto justify-center gap-x-2 mt-4 mb-2">
                <FaRegClock />
                <span className="my-auto">TIME</span>
              </p>
              <div className="flex w-full justify-between px-3 py-2 border rounded-lg bg-blue-400/20">
                <div className="w-full flex flex-col gap-y-2">
                  <div className="flex w-full justify-between">
                    <p className="text-2xl text-white text-left my-auto">
                      TOTAL PLAY TIME
                    </p>
                    <p className="text-5xl text-white">
                      {playTimeInLevel} second
                    </p>
                  </div>
                  <div className="flex w-full justify-between">
                    <p className="text-xl text-white text-left my-auto">
                      TOTAL DEATH
                    </p>
                    <p className="text-3xl text-white">1 time</p>
                  </div>
                </div>
              </div>
              <p className="text-3xl text-white text-center flex mx-auto justify-center gap-x-2 mt-4 mb-2">
                <PiTrophy className="text-5xl" />
                <span className="my-auto">REWARDS</span>
              </p>
              <div className="flex w-full justify-between px-3 py-3 border rounded-lg bg-blue-400/20">
                <div className="w-full flex gap-x-4">
                  <div className="flex flex-col w-fit px-3 py-2 rounded-2xl bg-orange-400/50 border border-orange-200">
                    <TiCloudStorage className="text-5xl text-white mx-auto" />
                    <p className="text-white">Cloud Storage</p>
                  </div>
                  <div className="flex flex-col w-fit px-3 py-2 rounded-2xl bg-orange-400/50 border border-orange-200">
                    <LiaBrainSolid className="text-5xl text-white mx-auto" />
                    <p className="text-white">New Algorithm</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-10 grid grid-cols-3 mt-10 gap-x-4">
              <div
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
                onClick={handlePlayAgain}
              >
                <VscDebugRestart className="text-5xl" />
                <p className="text-2xl my-auto ml-3 whitespace-nowrap">
                  Play Again
                </p>
              </div>
              <div
                onClick={handlePlayNextLevel}
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
              >
                <GrLinkNext className="text-5xl" />
                <p className="text-2xl my-auto ml-3">Continue</p>
              </div>
              <div
                className="px-3 py-3 bg-cyan-400/50 w-full rounded-2xl flex justify-between text-white border-2 border-slate-100/50
              hover:scale-105 hover:bg-cyan-400/80 hover:text-white transition-all duration-200 ease-linear cursor-pointer"
                onClick={handleBackToHome}
              >
                <TiHomeOutline className="text-5xl" />
                <p className="text-2xl my-auto ml-3">Home</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStar && (
        <div className="absolute z-50 flex items-center justify-center h-screen w-screen animate-heartBeat">
          <CiStar className="absolute text-[10rem] text-yellow-400/50 animate-ping" />
        </div>
      )}
      {showDeathContainer && <div id="death-container"></div>}
      {showEnemySplash === true && (
        <>
          {enemyHitName === "Slime" && (
            <div className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-green-600/60">
              <div className=" opacity-60 animate-heartBeat">
                <img
                  src={`/images/effect/slimesplash.png`}
                  alt="enemy"
                  className="w-[80vh] h-[80vh] animate-jello"
                />
              </div>
            </div>
          )}
          {enemyHitName === "Spider" && (
            <div className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-white/60">
              <div className=" opacity-60 animate-heartBeat">
                <img
                  src={`/images/effect/spidersplash.png`}
                  alt="enemy"
                  className="w-[80vh] h-[80vh] animate-jello"
                />
              </div>
            </div>
          )}
          {enemyHitName === "Golem" && (
            <div
              className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-red-600/40"
              style={{ backdropFilter: "blur(4px)" }}
            ></div>
          )}
          {enemyHitName === "Boss" && (
            <div
              className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-red-600/40"
              style={{ backdropFilter: "blur(4px)" }}
            ></div>
          )}
        </>
      )}
      {showPlayAgain && (
        <div
          className={`absolute ${
            showPlayAgain ? "opacity-100" : "opacity-0"
          } inset-0 flex items-center justify-center z-[100000] 
          flex-col w-full h-full bg-red-400/50`}
        >
          <div className="w-52 -rotate-45 mb-10">
            <img src="/images/Profile.png" />
          </div>
          <button
            className="text-3xl w-80 bg-cyan-400/80 px-4 py-3 border-2 text-slate-600 duration-200 hover:text-white
            font-semibold justify-between rounded-xl flex tracking-wider hover:bg-cyan-500/80 hover:scale-105 transition-all easer-linear"
            onClick={() => {
              // location.reload();
              handlePlayerRespawn();
              // console.log("Player Clicked Play Again");
              // handlePlayAgain();
              // setShowPlayAgain(false);
            }}
          >
            <MdOutlineReplay className="my-auto mr-2" />
            <span>Play Again</span>
          </button>
          <button
            className="text-3xl w-80 min-w-xl mt-2 bg-cyan-400/80 px-4 py-3 border-2 text-slate-600 duration-200 hover:text-white
            font-semibold justify-between rounded-xl flex tracking-wider hover:bg-cyan-500/80 hover:scale-105 transition-all easer-linear"
            onClick={() => {
              // location.reload();
              setScene(currentScene, "home");
              setShowPlayAgain(false);
            }}
          >
            <IoIosHome className="my-auto mr-2" />
            <span>Back to Home</span>
          </button>
        </div>
      )}
      {isFadingBetweenRoom && (
        <div
          className={`absolute z-[12000] bg-black w-full h-full ${
            isFadingBetweenRoom ? "fadeIn" : "fadeOut"
          }`}
        ></div>
      )}
      {/* <PlayerMainUI /> */}
      {location.pathname === "/" && <PlayerMainUI />}
      {currentHit?.includes("computer") &&
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
      {currentHit === "door" && (
        <AskForInputKeyDown title="Press E to Enter The Door" />
      )}
      {currentHit?.includes("guard") && !isInteracting && (
        <AskForInputKeyDown title="Press E to Interact with Guard" />
      )}
      {isCoding && <TrainAiComputer />}
      {currentHit === "LiftObjectTutorial" && (
        <AskForInputKeyDown title="Press E to Lift Up The Crane" />
      )}
      {currentHit === "Level1-Crane-Computer" && (
        <AskForInputKeyDown title="Press E to Lift Up The Crane" />
      )}
      {currentHit?.includes("Computer-camera-01") &&
        (!isUsingSecurityCamera ? (
          <AskForInputKeyDown title="Press E to Access Security Camera" />
        ) : currentHit.includes("trigger") === true ? (
          <>
            <div className="absolute z-[100] top-2 left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-xl mt-12">
                Distance from camera: {currentHit.split(":")[1]} unit
              </h1>
            </div>
            <div className="absolute z-[100] bottom-[18rem] left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-xl">
                Press G to Get Numerical Data (Distance)
              </h1>
            </div>
            <div className="absolute z-[100] bottom-60 left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-lgw">
                Press Space Bar to trigger object
              </h1>
            </div>
            <AskForInputKeyDown title="Press E to Leave Security Camera" />
          </>
        ) : (
          <AskForInputKeyDown title="Press E to Leave Security Camera" />
        ))}
      {currentHit?.includes("Loot") && (
        <AskForInputKeyDown title="Press E to Open Loot Box" />
      )}
      {currentHit === "CameraData" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Camera" />
        ) : (
          <AskForInputKeyDown title="Press E to Leave Camera" />
        ))}
      {currentHit?.includes("Bot") &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Interact with Robot" />
        ) : (
          <AskForInputKeyDown title="Press E to Leave Robot" />
        ))}
      {currentHit === "Crane-Computer-Level-3" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Controller" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Controller" />
            <div className="absolute z-[100] bottom-[8.25rem] left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-xl">
                Press Space Bar to Activate Fire
              </h1>
            </div>
          </>
        ))}
      {currentHit === "Speaker-Level3" &&
        (!isCarryingObject ? (
          <AskForInputKeyDown title="Press E to Pick The Speaker" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave The Speaker" />
            {/* <div className="absolute z-[100] bottom-[8.25rem] left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-xl">
                Press Space Bar to Activate Fire
              </h1>
            </div> */}
          </>
        ))}
      {currentHit === "StereoRack-Level3" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Open Audio Stereo" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Audio Stereo" />
          </>
        ))}
      {currentHit === "Level4-OCR-Computer" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer" />
          </>
        ))}
      {currentHit === "ComputerVideo-Level3" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer" />
          </>
        ))}
      {currentHit === "CD" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Open CD" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Close CD" />
          </>
        ))}
      {currentHit === "Crane-Computer-Level-3" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Controller" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Controller" />
            <div className="absolute z-[100] bottom-[8.25rem] left-1/2 transform -translate-x-1/2">
              <h1 className="text-white text-xl">
                Press Space Bar to Activate Fire
              </h1>
            </div>
          </>
        ))}

      {currentHit === "Level4-CharacterStorage" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Open Storage" />
        ) : (
          <AskForInputKeyDown title="Press E to Close Storage" />
        ))}

      {currentHit === "Level4-TrainComputer" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ) : (
          <AskForInputKeyDown title="Press E to Leave Computer" />
        ))}

      {currentHit === "Online1-Computer" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer" />
        ) : (
          <AskForInputKeyDown title="Press E to Leave Computer" />
        ))}
      {currentHit === "GlassComputerLevel2" &&
        (!isUsingSecurityCamera ? (
          <AskForInputKeyDown title="Press E to Access Computer" />
        ) : (
          <>
            <AskForInputKeyDown title="Scanning Danger Glass" />
          </>
        ))}
      {currentHit === "ComputerTrainAILevel3" ||
        (currentHit === "ComputerGlassTrainLevel2" &&
          (!isInteracting ? (
            <AskForInputKeyDown title="Press E to Access Computer" />
          ) : (
            <>
              <AskForInputKeyDown title="Press E to Leave Computer" />
            </>
          )))}
      {currentHit?.includes("TurretGun") &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Control Turret Gun" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Turret Gun" />
          </>
        ))}
      {currentHit === "BossHologramComputer" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Boss Hologram" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Boss Hologram" />
          </>
        ))}
      {currentHit?.includes("Glass") &&
        currentHit !== "ComputerTestGlass" &&
        currentHit !== "GlassComputerLevel2" &&
        currentHit !== "ComputerGlassTrainLevel2" &&
        (!isCarryingObject ? (
          currentHit?.includes("RevealGlass") ? (
            <AskForInputKeyDown title="Press E to Collect A Data" />
          ) : currentHit?.includes("TestGlass") ? (
            <AskForInputKeyDown title="Press E to Test A Glass" />
          ) : (
            <AskForInputKeyDown title="Press E to Lift A Glass" />
          )
        ) : (
          <AskForInputKeyDown title="Press E to Drop A Glass" />
        ))}

      {currentHit.includes("WeightRock") && (
        <>
          {!isCarryingObject ? (
            <AskForInputKeyDown title="Press E to Lift A Rock" />
          ) : (
            <AskForInputKeyDown title="Press E to Drop A Rock" />
          )}
        </>
      )}

      {currentHit === "GreenBox" && (
        <>
          {!isCarryingObject ? (
            <AskForInputKeyDown title="Press E to Lift A Box" />
          ) : (
            <AskForInputKeyDown title="Press E to Drop A Box" />
          )}
        </>
      )}

      {currentHit === "RedBox" && (
        <>
          {!isCarryingObject ? (
            <AskForInputKeyDown title="Press E to Lift A Box" />
          ) : (
            <AskForInputKeyDown title="Press E to Drop A Box" />
          )}
        </>
      )}

      {currentHit === "ComputerTestGlass" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Computer" />
        ) : (
          <AskForInputKeyDown title="Press E to Leave Computer" />
        ))}
      {currentHit === "DoorToBossFight" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Boss Room" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Boss Room" />
          </>
        ))}
      {currentHit === "ComputerChooseModelLevel5" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer Model Choosing" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer Model Choosing" />
          </>
        ))}
      {currentHit === "ComputerEnemyLab" &&
        (!isUsingSecurityCamera ? (
          <AskForInputKeyDown title="Press E to Enter Computer Enemy Lab" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer Enemy Lab" />
          </>
        ))}
      {currentHit === "ComputerTrainingEnemyLab" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer Training" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer Training" />
          </>
        ))}
      {currentHit === "ComputerMazeSolver" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Enter Computer Maze Solver" />
        ) : (
          <>
            {!isUsingSecurityCamera ? (
              <AskForInputKeyDown title="Press E to Leave Computer Maze Solver" />
            ) : (
              <AskForInputKeyDown title="Press E to Cancle Maze Solver" />
            )}
          </>
        ))}
    </>
  );
};
export default GlobalGameUI;
