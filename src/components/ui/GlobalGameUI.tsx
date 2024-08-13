import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import PlayerMainUI from "./player-main-ui/PlayerMainUI";
import TrainAiComputer from "./computer/train-ai-computer/TrainAiComputer";
import { MdOutlineReplay } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { CiStar } from "react-icons/ci";

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
    isEnemyHit,
    enemyHitName,
    setIsEnemyHit,
    setEnemyHitName,
    showStar
  } = useContext(GameContext);

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

  return (
    <>
      {showStar && <div className="absolute z-50 flex items-center justify-center h-screen w-screen animate-heartBeat">
        <CiStar className="absolute text-[10rem] text-yellow-400/50 animate-ping" />
      </div>}
      {showDeathContainer && <div id="death-container"></div>}
      {showEnemySplash === true &&
        <>
          {enemyHitName === "Slime" &&
            <div className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-green-600/60">
              <div className=" opacity-60 animate-heartBeat">
                <img src={`/images/effect/slimesplash.png`} alt="enemy" className="w-[80vh] h-[80vh] animate-jello" />
              </div>
            </div>
          }
          {enemyHitName === "Spider" &&
            <div className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-white/60">
              <div className=" opacity-60 animate-heartBeat">
                <img src={`/images/effect/spidersplash.png`} alt="enemy" className="w-[80vh] h-[80vh] animate-jello" />
              </div>
            </div>
          }
          {enemyHitName === "Golem" &&
            <div className=" absolute w-full h-full flex items-center justify-center z-[100000] bg-red-600/40"
              style={{ backdropFilter: "blur(4px)" }}>
            </div>
          }
        </>
      }
      {showPlayAgain && (
        <div
          className={`absolute ${showPlayAgain ? "opacity-100" : "opacity-0"
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
              location.reload();
              setShowPlayAgain(false);
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
          className={`absolute z-[12000] bg-black w-full h-full ${isFadingBetweenRoom ? "fadeIn" : "fadeOut"
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
            <AskForInputKeyDown title="Press E to Leave Computer Maze Solver" />
          </>
        ))}
    </>
  );
};
export default GlobalGameUI;
