import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import PlayerMainUI from "./player-main-ui/PlayerMainUI";
import TrainAiComputer from "./computer/train-ai-computer/TrainAiComputer";

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
  const {
    currentHit,
    isCoding,
    isInteracting,
    isFadingBetweenRoom,
    isUsingSecurityCamera,
    isCarryingObject,
  } = useContext(GameContext);

  return (
    <>
      {isFadingBetweenRoom && (
        <div
          className={`absolute z-[12000] bg-black w-full h-full ${isFadingBetweenRoom ? "fadeIn" : "fadeOut"
            }`}
        ></div>
      )}
      {/* <PlayerMainUI /> */}
      <PlayerMainUI />
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

      {currentHit === "ComputerTrainAILevel3" &&
        (!isInteracting ? (
          <AskForInputKeyDown title="Press E to Access Computer" />
        ) : (
          <>
            <AskForInputKeyDown title="Press E to Leave Computer" />
          </>
        ))}
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
    </>
  );
};
export default GlobalGameUI;
