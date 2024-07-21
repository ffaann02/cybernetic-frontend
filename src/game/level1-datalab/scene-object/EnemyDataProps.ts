export const enemyPartrolProps = [
    {
        name: "Slime",
        waypoints: [
            [-10, 1.2, 4],
            [-10, 1.2, 10],
            [0, 1.2, 10],
            [0, 1.2, 4],
        ],
        angle: 45,
        idleTime: 2,
        chaseTimeLimit: 5,
        patrolType: "turnback",
        showPath: true,
        data: {
            data_type: "enemy",
            name: "Robotic Slime - enemy",
            element: "fire",
            size: "tiny",
            color: "blue",
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