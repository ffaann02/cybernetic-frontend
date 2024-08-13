const items = [
  {
    name: "Floor",
    fileType: "glb",
    position: [0, -0.3, 0],
    scale: [100, 2.5, 100],
    rotation: 0,
  },
  {
    name: "LargeBuilding",
    fileType: "glb",
    position: [0, 0, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "LargeBuilding2",
    fileType: "glb",
    position: [4.5, 0, 3.8],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "LargeBuilding2",
    fileType: "glb",
    position: [4.5, 4, 3.8],
    scale: [2.5, 2.5, 2.5],
    rotation: 0,
  },
  {
    name: "Skyscrapers",
    fileType: "glb",
    position: [10, 0, 4],
    scale: [-0.04, 0.04, 0.04],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Skyscrapers",
    fileType: "glb",
    position: [10, 0, -5],
    scale: [-0.04, 0.04, 0.04],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, -0.8],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, 1.06],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, -2.6],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "Fence",
    fileType: "glb",
    position: [7, 0, -4.3],
    scale: [0.5, 0.5, 0.5],
    rotation: 3,
    rotateZ: 0,
  },
  {
    name: "HoveTank",
    fileType: "glb",
    position: [-2.8, 0.5, 0.5],
    rotation: 0,
    scale: [2, 2, 2],
  },
  {
    name: "BladeRunnerMemory",
    fileType: "glb",
    position: [-3.2, 1.48, 0],
    rotation: 0,
    scale: [1, 1, 1],
  },
  {
    name: "BladeRunnerMemory",
    fileType: "glb",
    position: [-2.5, 1.48, -0.7],
    rotation: 0,
    scale: [1, 1, 1],
  },
  {
    name: "Probodobodyne",
    fileType: "glb",
    position: [-5.8, 0, 0],
    rotation: 0,
    scale: [0.5, 0.5, 0.5],
  },
  {
    name: "SecurityCamera",
    fileType: "glb",
    position: [-2.15, 0.95, -1.8],
    rotation: 0,
    scale: [0.06, 0.06, 0.06],
  },
  {
    name: "SecurityCamera",
    fileType: "glb",
    position: [1.9, 0.95, -2.15],
    rotation: 3,
    scale: [0.06, 0.06, 0.06],
  },
  {
    name: "PlasmaTurret",
    fileType: "glb",
    position: [-1.4, 5.2, -1.4],
    rotation: 3.2,
    scale: [0.25, 0.25, 0.25],
    spinSpeed: 0,
    spinAxis: "y",
  },
  {
    name: "Factory",
    fileType: "glb",
    position: [-4, 0, 8.4],
    rotation: 0,
    scale: [0.005, 0.005, 0.005],
    spinSpeed: 0,
    spinAxis: "y",
  },
  {
    name: "Crane",
    fileType: "glb",
    position: [-12.5, -0.2, 5.4],
    rotation: 3,
    scale: [1, 1, 1],
    spinSpeed: 0,
    spinAxis: "y",
  },
  // {
  //   name: "AngryRoboDancer",
  //   fileType: "glb",
  //   position: [-4, 6.2, 5.2],
  //   rotation: 0,
  //   scale: [0.25, 0.25, 0.25],
  //   spinSpeed: 0,
  //   spinAxis: "y",
  // },
  {
    name: "Highway",
    fileType: "glb",
    position: [80, 0, 170],
    scale: [-0.04, 0.04, -0.04],
    rotation: 0,
    rotateZ: 0,
  },
  {
    name: "lowpolycity",
    fileType: "glb",
    position: [0, 5, 80],
    scale: [7.5, 7.5, 7.5],
    rotation: 0,
    rotateZ: 0,
  },
  {
    name: "lowpolycity",
    fileType: "glb",
    position: [-40, 5, 80],
    scale: [7.5, 7.5, 7.5],
    rotation: 0,
    rotateZ: 0,
  },
];

const idleItems = [
  {
    name: "VRDRONE",
    fileType: "glb",
    position: [2, 2, -3],
    rotation: 2.2,
    scale: [0.25, 0.25, 0.25],
    idleAnimation: true,
    idleSpeed: 1,
    idleAmplitude: 1.5,
    idleAxis: "x",
    haslight: true,
    lightIntensity: 1,
    lightRotationY: 0.32,
  },
  {
    name: "VRDRONE",
    fileType: "glb",
    position: [-3, 3, 3],
    rotation: 0,
    scale: [-0.25, 0.25, 0.25],
    idleAnimation: true,
    idleSpeed: 1,
    idleAmplitude: 1,
    idleAxis: "xy",
    haslight: true,
    lightIntensity: 0.8,
    lightRotationY: 4.2,
  },
  {
    name: "GenericRoboDude",
    fileType: "glb",
    position: [1.5, 0.38, -2.2],
    rotation: 1.9,
    scale: [0.6, 0.6, 0.6],
    idleAnimation: true,
    idleSpeed: 7.5,
    idleAmplitude: 0.005,
    idleAxis: "y",
  },
  {
    name: "GenericRoboDude",
    fileType: "glb",
    position: [-1.2, 0.38, -2.2],
    rotation: 2.6,
    scale: [0.6, 0.6, 0.6],
    idleAnimation: true,
    idleSpeed: 7.5,
    idleAmplitude: 0.005,
    idleAxis: "y",
  },
];

const itemSpin = [
  {
    name: "GeodesicDome",
    fileType: "glb",
    position: [-5.8, 0.5, 0],
    rotation: 0,
    scale: [0.1, 0.1, 0.1],
    spinSpeed: 2,
    spinAxis: "y",
  },
  {
    name: "Satellitedish",
    fileType: "glb",
    position: [1.2, 5, -1.4],
    rotation: 0,
    scale: [0.05, 0.05, 0.05],
    spinSpeed: 0.5,
    spinAxis: "y",
  },
];

export { items, idleItems, itemSpin };
