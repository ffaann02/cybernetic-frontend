import { degreeNumberToRadian } from "../../../../utils";

export const LaserTargetObjectData = [
    {
        id: "1",
        rigidBody: {
            position: [-47.5, 18, -2.8],
            scale: [1.5, 1.5, 1.5],
            rotation: [degreeNumberToRadian(0), degreeNumberToRadian(0), degreeNumberToRadian(0)],
            addjustPosition: [-45, 17, -2.8]
        },
        outline: {
            normalThickness: 1,
            focusedThickness: 3,
        },
        item: {
            name: "NostalgicTV",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [1, 1, 1]
        }

    },
    {
        id: "2",
        rigidBody: {
            position: [-50, 18, 16],
            scale: [30, 30, 30],
            rotation: [degreeNumberToRadian(0), degreeNumberToRadian(180), degreeNumberToRadian(90)],
            addjustPosition: [-45, 17, 16]
        },
        item: {
            name: "SatelliteDish",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [0.005, 0.005, 0.005],
        },
        outline: {
            normalThickness: 1,
            focusedThickness: 3,
        },
        spin: {
            isSpin: true,
            spinSpeed: 2,
            spinAxis: "y"
        }
    },
    {
        id: "3",
        rigidBody: {
            position: [-20, 17, -23.5],
            scale: [30, 30, 30],
            rotation: [degreeNumberToRadian(0), degreeNumberToRadian(270), degreeNumberToRadian(90)],
            addjustPosition: [-20, 16, -22],
        },
        item: {
            name: "AirConditioner",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [8, 8, 8],
        },
        outline: {
            normalThickness: 3,
            focusedThickness: 5,
        }
    },
    {
        id: "4",
        rigidBody: {
            position: [-40, 17, -22],
            scale: [0.2, 0.2, 0.2],
            rotation: [degreeNumberToRadian(90), degreeNumberToRadian(0), degreeNumberToRadian(0)],
            addjustPosition: [-20, 16, -20],
        },
        item: {
            name: "DefenseTurret",
            position: [0, 0, 0],
            fileType: "glb",
            rotation: 0,
            scale: [8, 8, 8],
        },
        outline: {
            normalThickness: 1,
            focusedThickness: 3,
        }
    }
]