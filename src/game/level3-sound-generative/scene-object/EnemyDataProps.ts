export const enemyPartrolProps = [
    {
        name: "Slime",
        waypoints: [
            [-26, 1.2, 14],
            [-18, 1.2, -6],
            [-2, 1.2, 10],
        ],
        angle: 45,
        idleTime: 2,
        chaseTimeLimit: 5,
        patrolType: "turnback",
        showPath: true,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "water",
            size: "tiny",
            color: "blue",
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
        name: "Slime",
        waypoints: [
            [-11, 1.2, 10],
            [-14, 1.2, -7],
        ],
        angle: 45,
        idleTime: 0.1,
        chaseTimeLimit: 6,
        patrolType: "turnback",
        showPath: true,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "fire",
            size: "tiny",
            color: "red",
            speed: 5,
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
        name: "Slime",
        waypoints: [
            [-24, 1.2, -10],
            [-2, 1.2, -10],
        ],
        angle: 45,
        idleTime: 0.2,
        chaseTimeLimit: 6,
        patrolType: "turnback",
        showPath: true,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "lightning",
            size: "tiny",
            color: "yellow",
            speed: 5,
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