import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import PlayerMainUI from "./player-main-ui/PlayerMainUI";
import TrainAiComputer from "./computer/train-ai-computer/TrainAiComputer";
const AskForInputKeyDown = ({ title }: { title: string }) => {
  return (
    <div className="absolute z-[100] bottom-44 left-1/2 transform -translate-x-1/2">
      <h1 className="text-white text-3xl">{title}</h1>
    </div>
  );
};

const GlobalGameUI = () => {
  const {
    currentHit,
    isCoding,
    isInteracting,
  } = useContext(GameContext);
  return (
    <>
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
      {currentHit?.includes("guard") && (
        <AskForInputKeyDown title="Press E to Interact with Guard" />
      )}

      {isCoding && <TrainAiComputer />}
    </>
  );
};
export default GlobalGameUI;
