import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useMemo } from "react";
import CharacterController, {
    Controls,
} from "../controllers/CharacterController";
import { Physics } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { KeyboardControls, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { SimpleEnvironment } from "../components/scene-environments/Simple";
import EnemyFollowController from "../controllers/EnemyFollowController";
import useAxios from "../hooks/useAxios";
import axiosInstanceAiService from "../api/aiService";
import EnemyGuardController from "../controllers/EnemyGuardController";

interface HomeProps { }

const TestEnemy: React.FC<HomeProps> = () => {

    const { axiosFetch } = useAxios();

    const { debug, camera } = useContext(GameContext);

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
        ],
        []
    );

    const testAPI = async () => {
        console.log("testAPI")
        try {
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "get",
                url: `/`,
            });
            console.log(response)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="w-full min-h-sc absolute z-50">
                <button className="text-black bg-red-200 p-4" onClick={() => testAPI()}>
                    TEST AI SERVICE
                </button>
            </div>
            <KeyboardControls map={controlMap}>
                <Canvas
                    dpr={[1, 2]}
                    style={{ height: "100%", width: "100%" }}
                    shadows
                    className="z-0"
                >
                    {camera === 2 && (
                        <PerspectiveCamera makeDefault position={[0, 6, 10]} />
                    )}
                     <OrbitControls />
                    <ambientLight intensity={1} />
                    <Suspense fallback={null}>
                        <Physics debug={debug} gravity={[0, -9.81, 0]}>
                            {/* <CharacterController /> */}
                            <EnemyGuardController
                                speed={3}
                                point1={[-6, 0.5, -10]}
                                point2={[-6, 0.5, 10]}
                                showPath={true} />
                            <EnemyFollowController
                                speed={3}
                                position={[6, 5, -4]}
                                showArea={true}
                                idleAreaRadius={6}
                                chasingAreaRadius={4} />
                            <SimpleEnvironment />
                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </>
    );
};

export default TestEnemy;
