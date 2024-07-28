import slimeIdleSprite from "/images/EnemySlimeIdleAnim.png";
import slimeRunningSprite from "/images/EnemySlimeRunningAnim.png";
import spiderIdleSprite from "/images/Spider_IdleAnim.png";
import spiderRunningSprite from "/images/Spider_RunAnim.png";
import BossIdleSprite from "/images/BossIdleAnim.png";
import BossBurstSprite from "/images/BossBurstAnim.png";

interface PlainAnimator {
    tilesAmountHorizontally: number;
    tilesAmountVertically: number;
    tilesAmount: number;
    frameRate: number;
}

export interface EnemyConfig {
    size:{
        width: number;
        height: number;
    }
    sprite: {
        idle: string;
        running: string;
    };
    plainAnimator: {
        idle: PlainAnimator; 
        running: PlainAnimator;
    };
    mesh: {
        position: [number, number, number];
    };
    collider: {
        args: [number, number];
        position: [number, number, number];
    };
}

export const enemyConfigs: { [key: string]: EnemyConfig } = {
    Slime: {
        size: {
            width: 4,
            height: 4,
        },
        sprite: {
            idle: slimeIdleSprite,
            running: slimeRunningSprite,
        },
        plainAnimator: {
            idle: {
                tilesAmountHorizontally: 10,
                tilesAmountVertically: 1,
                tilesAmount: 10,
                frameRate: 10,
            },
            running: {
                tilesAmountHorizontally: 8,
                tilesAmountVertically: 1,
                tilesAmount: 8,
                frameRate: 8,
            },
        },
        mesh: {
            position: [0, 2, 0],
        },
        collider: {
            args: [0.3, 1],
            position: [0, 1.5, 0],
        }
    },
    Spider: {
        size: {
            width: 6,
            height: 6,
        },
        sprite: {
            idle: spiderIdleSprite,
            running: spiderRunningSprite,
        },
        plainAnimator: {
            idle: {
                tilesAmountHorizontally: 7,
                tilesAmountVertically: 1,
                tilesAmount: 7,
                frameRate: 7,
            },
            running: {
                tilesAmountHorizontally: 5,
                tilesAmountVertically: 1,
                tilesAmount: 5,
                frameRate: 5,
            },
        },
        mesh: {
            position: [0, 2, 0],
        },
        collider: {
            args: [0.2, 1],
            position: [0, 1.4, 0],
        }
    },
    Golem: {
        sprite: {
            idle: spiderIdleSprite,
            running: spiderRunningSprite,
        },
        plainAnimator: {
            idle: {
                tilesAmountHorizontally: 7,
                tilesAmountVertically: 1,
                tilesAmount: 7,
                tilesHorizontal: 7,
            },
            running: {
                tilesAmountHorizontally: 5,
                tilesAmountVertically: 1,
                tilesAmount: 5,
                tilesHorizontal: 5,
            },
        },
        mesh: {
            position: [0, 2, 0],
        },
        collider: {
            args: [0.2, 1],
            position: [0, 1.4, 0],
        }
    }
};
