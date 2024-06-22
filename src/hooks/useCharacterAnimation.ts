// useCharacterAnimation.ts
import { useState } from "react";

export enum AnimationState {
  Idle = "idle",
  Running = "running",
  Jumping = "jumping",
}

export const useCharacterAnimation = () => {
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
      forwardPressed ||
      backwardPressed ||
      leftPressed ||
      rightPressed
    ) {
      setAnimationState(AnimationState.Running);
    } else {
      setAnimationState(AnimationState.Idle);
    }
  };

  return { animationState, updateAnimationState };
};
