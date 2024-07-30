// useCharacterAnimation.ts
import { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext";

export enum AnimationState {
  Idle = "idle",
  Running = "running",
  Jumping = "jumping",
  Picking = "picking",
  PickingIdle = "picking_idle",
  Death = "death"
}

export const useCharacterAnimation = () => {
  const { isCarryingObject, isDeath } = useContext(GameContext);
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.Idle
  );

  const updateAnimationState = (
    forwardPressed: boolean,
    backwardPressed: boolean,
    leftPressed: boolean,
    rightPressed: boolean,
    jumpPressed: boolean,
    isOnFloor: boolean,
    jumpCooldown: boolean
  ) => {
    if (jumpPressed && !jumpCooldown && isOnFloor) {
      setAnimationState(AnimationState.Jumping);
    } else if (
      (forwardPressed || backwardPressed || leftPressed || rightPressed) &&
      !isCarryingObject
    ) {
      if (!isOnFloor) {
        setAnimationState(AnimationState.Jumping);
      } else {
        setAnimationState(AnimationState.Running);
      }
    } else if (isCarryingObject) {
      if (forwardPressed || backwardPressed || leftPressed || rightPressed) {
        setAnimationState(AnimationState.Picking);
      } else {
        setAnimationState(AnimationState.PickingIdle);
      }
    } else {
      setAnimationState(AnimationState.Idle);
    }
  };

  return { animationState, setAnimationState, updateAnimationState };
};
