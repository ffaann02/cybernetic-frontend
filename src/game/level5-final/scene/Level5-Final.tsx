import React, { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import { GameContext } from '../../../contexts/GameContext';
import CharacterController, { Controls } from '../../../controllers/CharacterController';
import { KeyboardControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Level5FinalEnvironment } from '../scene-object/Level5-FinalEnvironment';
import BossDisplayUI from '../ui/BossDisplayUI';
import TurretGunUI from '../ui/TurretGunUI';
import BossHologramUI from '../ui/BossHologramUI';
import Level5ModelChoosingUI from '../ui/Level5ModelChoosingUI';

type Props = {}

const Level5Final: React.FC<Props> = () => {

    const { debug, currentCamera } = useContext(GameContext);

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
        ],
        []
    );

    return (
        <>
            <BossDisplayUI />
            <TurretGunUI />
            <BossHologramUI />
            <Level5ModelChoosingUI />
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
                            <CharacterController spawnPosition={[-28, 2, 20]} />
                            {/* <CharacterController /> */}
                            <Level5FinalEnvironment />
                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </>
    )
}

export default Level5Final