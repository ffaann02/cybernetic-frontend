export interface AttackPattern {
    id: number;
    name: string;
    distribution: number[][]; // 2D array representing which cells to attack
    energySource: string;
    soundBreathing: string;
    chargingTime: number; // time in seconds
    lastActiveTurret?: string;
    bossHealth?: number;
}

export const bossAttackPatternsArray: AttackPattern[] = [
    {
        id: 1,
        name: 'X-shape',
        distribution: [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        ],
        energySource: "fire",
        soundBreathing: 'deep',
        chargingTime: 3,
        lastActiveTurret: 'middle',
        bossHealth: 80
    },
    {
        id: 2,
        name: 'Vertical-lines',
        distribution: [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        ],
        energySource: "water",
        soundBreathing: 'fast',
        chargingTime: 2,
        lastActiveTurret: 'left',
        bossHealth: 70
    },
    {
        id: 3,
        name: 'Checkerboard',
        distribution: [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        ],
        energySource: "lightning",
        soundBreathing: 'normal',
        chargingTime: 4,
        lastActiveTurret: 'right',
        bossHealth: 90
    },
    {
        id: 4,
        name: 'Diamond',
        distribution: [
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        ],
        energySource: "fire",
        soundBreathing: 'slow',
        chargingTime: 5,
        lastActiveTurret: 'middle',
        bossHealth: 85
    },
    {
        id: 5,
        name: 'Horizontal-lines',
        distribution: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        energySource: "earth",
        soundBreathing: 'heavy',
        chargingTime: 3,
        lastActiveTurret: 'left',
        bossHealth: 60
    },
    {
        id: 6,
        name: 'Zigzag',
        distribution: [
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        ],
        energySource: "fire",
        soundBreathing: 'erratic',
        chargingTime: 2,
        lastActiveTurret: 'middle',
        bossHealth: 70
    },
    {
        id: 7,
        name: 'Cross',
        distribution: [
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
        ],
        energySource: "holy",
        soundBreathing: 'calm',
        chargingTime: 4,
        lastActiveTurret: 'left',
        bossHealth: 75
    },
    {
        id: 8,
        name: 'Corners',
        distribution: [
            [1,1,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,1,1],
        ],
        energySource: "lightning",
        soundBreathing: 'cautious',
        chargingTime: 3,
        lastActiveTurret: 'left',
        bossHealth: 75
    },
    {
        id: 9,
        name: 'Spiral',
        distribution: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        ],
        energySource: "wind",
        soundBreathing: 'whisper',
        chargingTime: 5,
        lastActiveTurret: 'right',
        bossHealth: 95
    },
    {
        id: 7,
        name: 'Random-blast',
        distribution: [
            [1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        ],
        energySource: "chaos",
        soundBreathing: 'erratic',
        chargingTime: 5,
        lastActiveTurret: 'middle',
        bossHealth: 50
    }
];
