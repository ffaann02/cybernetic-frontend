import slimeIdleSprite from "/images/EnemySlimeIdleAnim.png";
import slimeRunningSprite from "/images/EnemySlimeRunningAnim.png";
import spiderIdleSprite from "/images/Spider_IdleAnim.png";
import spiderRunningSprite from "/images/Spider_RunAnim.png";
import golemAttackSprite from "/images/GolemAttack.png";
import golemIdleSprite from "/images/GolemIdle.png";
import golemRunningSprite from "/images/GolemWalk.png";

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
        attack?: string;
    };
    plainAnimator: {
        idle: PlainAnimator; 
        running: PlainAnimator;
        attack?: PlainAnimator;
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
        size:{
            width: 6,
            height: 6,
        },
        sprite: {
            idle: golemIdleSprite,
            running: golemRunningSprite,
            attack: golemAttackSprite,
        },
        plainAnimator: {
            idle: {
                tilesAmountHorizontally: 6,
                tilesAmountVertically: 1,
                tilesAmount: 6,
                frameRate: 6,
            },
            running: {
                tilesAmountHorizontally: 4,
                tilesAmountVertically: 1,
                tilesAmount: 4,
                frameRate: 6,
            },
            attack: {
                tilesAmountHorizontally: 9,
                tilesAmountVertically: 1,
                tilesAmount: 9,
                frameRate: 9,
            },
        },
        mesh: {
            position: [0, 2, 0],
        },
        collider: {
            args: [0.5, 2.0],
            position: [0, 1.8, 0],
        }
    }
};
