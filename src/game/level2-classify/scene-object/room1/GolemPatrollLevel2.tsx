export const GolemPatrollLevel2 = [
    {
        name: "Golem",
        waypoints: [
            [-28, 1.5, 12],
            [-28, 1.5, 4],
            [-14, 1.5, 4],
        ],
        angle: 45,
        idleTime: 1,
        chaseTimeLimit: 0.8,
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
            detection_range: 10,
            image_url: "/images/slime_default.png"
        }
    },
]