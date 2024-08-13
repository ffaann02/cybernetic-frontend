export const enemyPartrolProps = [
    {
        name: "Slime",
        waypoints: [
            [-40, 1.2, 20],
            [-20, 1.2, 20],
        ],
        angle: 45,
        idleTime: 2,
        chaseTimeLimit: 5,
        patrolType: "turnback",
        showPath: false,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "water",
            size: "tiny",
            color: "orange",
            speed: 8,
            mass: 50,
            armor: 8,
            attack: "chase",
            energy: 150,
            pattern: "",
            weakness: "water",
            detection_range: 5,
            image_url: "/images/slime_default.png"
        }
    },
    {
        name: "Spider",
        waypoints: [
            [-20, 1.2, 10],
            [-10, 1.2, 10],
            [-10, 1.2, 0],
        ],
        angle: 45,
        idleTime: 2,
        chaseTimeLimit: 5,
        patrolType: "loop",
        showPath: false,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "fire",
            size: "tiny",
            color: "",
            speed: 8,
            mass: 50,
            armor: 8,
            attack: "chase",
            energy: 150,
            pattern: "",
            weakness: "water",
            detection_range: 5,
            image_url: "/images/slime_default.png"
        }
    },
    {
        name: "Spider",
        waypoints: [
            [-35, 1.2, 10],
            [-25, 1.2, 10],
            [-25, 1.2, 0],
        ],
        angle: 45,
        idleTime: 2,
        chaseTimeLimit: 5,
        patrolType: "loop",
        showPath: false,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "lightning",
            size: "tiny",
            color: "",
            speed: 8,
            mass: 50,
            armor: 8,
            attack: "chase",
            energy: 150,
            pattern: "",
            weakness: "water",
            detection_range: 5,
            image_url: "/images/slime_default.png"
        }
    },
]