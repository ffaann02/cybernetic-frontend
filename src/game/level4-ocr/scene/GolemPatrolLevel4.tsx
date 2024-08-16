export const GolemPatrolLevel4 = [
    {
        name: "Golem",
        scale: 1.4,
        waypoints: [
            [-30, 1.5, 6],
            [-30, 1.5, 32],
            [-19, 1.5, 32],
            [-19, 1.5, 6],
            [-19, 1.5, 32],
            [-8, 1.5, 32],
            [-8, 1.5, 6],
        ],
        angle: 20,
        idleTime: 1,
        chaseTimeLimit: 0.8,
        patrolType: "loop",
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
            detection_range: 8,
            image_url: "/images/slime_default.png"
        }
    },
]