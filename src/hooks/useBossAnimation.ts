// useCharacterAnimation.ts
import { useState } from "react";

export enum BossAnimationState {
    Idle = "idle",
    Burst = "burst",
}

export const useBossAnimation = () => {
    const [animationState, setAnimationState] = useState<BossAnimationState>(
        BossAnimationState.Idle
    );

    return { animationState, setAnimationState };
};
