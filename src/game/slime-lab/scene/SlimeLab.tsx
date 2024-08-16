import React, { Suspense, useContext, useMemo, useState } from 'react'
import CharacterController, { Controls } from '../../../controllers/CharacterController';
import { KeyboardControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { GameContext } from '../../../contexts/GameContext';
import SlimeLabEnvironment from '../scene-object/SlimeLabEnvironment';
import EnemyLabComputerUI from '../ui/EnemyLabComputerUI';
import EnemyLabTrainUI from '../ui/EnemyLabTrainUI';

type Props = {}

const SlimeLab = (props: Props) => {

  const { debug, currentCamera } = useContext(GameContext);
  const enemyNameChoices = ["Slime", "Spider", "Golem"];
  const enemyColorChoices = ["red", "orange", "cyan", "green", "white", "yellow"];
  const [selectedEnemy, setSelectedEnemy] = useState<any>(
    {
      id: 1,
      name: "Slime",
      color: "green",
      element: "fire",
      size: "small",
      speed: 2,
      weakness: "water",
  });
  const predictionModelChoices = [
    { name: "v1", value: "enemy-lab-model-v1" },
    { name: "v2", value: "enemy-lab-model-v2" },
    { name: "v3", value: "enemy-lab-model-v3" },
  ];
  const [predictionModelSelected, setPredictionModelSelected] = useState<{ name: "v1", value: "enemy-lab-model-v1"}>({
    name: "v1",
    value: "enemy-lab-model-v1",
  });
  const [collectedEnemyData, setCollectedEnemyData] = useState<any[]>([]);

  const controlMap = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.coding, keys: ["KeyE"] },
      { name: Controls.interact, keys: ["KeyR"] },
      { name: Controls.ESC, keys: ["Escape"] },
      { name: Controls.L, keys: ["KeyL"] },
      { name: Controls.G, keys: ["KeyG"] },
      { name: Controls.I, keys: ["KeyI"] },
    ],
    []
  );

  return (
    <>
      <EnemyLabComputerUI
        selectedEnemy={selectedEnemy}
        setSelectedEnemy={setSelectedEnemy}
        enemyNameChoices={enemyNameChoices}
        enemyColorChoices={enemyColorChoices}
        predictionModelChoices={predictionModelChoices}
        collectedEnemyData={collectedEnemyData}
        setCollectedEnemyData={setCollectedEnemyData}
      />
      <EnemyLabTrainUI
        predictionModelChoices={predictionModelChoices}
        collectedEnemyData={collectedEnemyData}
        predictionModelSelected={predictionModelSelected}
        setPredictionModelSelected={setPredictionModelSelected}
        setCollectedEnemyData={setCollectedEnemyData}/>
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          {/* <fog attach="fog" args={["skyblue", 15, 30]} /> */}
          <color attach="background" args={["black"]} />
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          {/* <PerspectiveCamera makeDefault position={[0, 2, 10]} /> */}
          <ambientLight intensity={0.5} color={"lightblue"} />

          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController />
              <SlimeLabEnvironment
                enemyNameChoices={enemyNameChoices}
                selectedEnemy={selectedEnemy} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default SlimeLab