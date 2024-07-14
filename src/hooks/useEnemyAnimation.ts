// useCharacterAnimation.ts
import { useState } from "react";

export enum EnemyAnimationState {
    Idle = "idle",
    Running = "running",
}

export const useEnemyAnimation = () => {
    const [animationState, setAnimationState] = useState<EnemyAnimationState>(
        EnemyAnimationState.Idle
    );

    const updateAnimationState = (
        isRunning: boolean,
    ) => {
        if (isRunning) {
            setAnimationState(EnemyAnimationState.Running);
        } else {
            setAnimationState(EnemyAnimationState.Idle);
        }
    };

    return { animationState, setAnimationState, updateAnimationState };
};
