import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext, useMemo, useState } from "react";
import CharacterController, {
    Controls,
} from "../controllers/CharacterController";
import { Physics, RigidBody } from "@react-three/rapier";
import { GameContext } from "../contexts/GameContext";
import { KeyboardControls, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import useAxios from "../hooks/useAxios";
import axiosInstanceAiService from "../api/aiService";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import EnemyPatrolController from "../controllers/EnemyPatrolController";

const Floor = () => {

    // Define the URL for the GLTF model
    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    const path = `/scene_environments/items/enemy-environment/Floor.glb`;
    const url = `${storageBucket}${path}`;

    const map = useGLTF(url);

    const clone = useMemo(() => {
        const clonedScene = SkeletonUtils.clone(map.scene);
        clonedScene.traverse((object) => {
            if ((object as any).isMesh) {
                object.receiveShadow = true;
            }
        });
        return clonedScene;
    }, [map.scene]);

    return (
        <RigidBody
            colliders="cuboid"
            type="fixed"
            name="floor"
            position={[0, -0.1, 0]}
            scale={[50, 0.5, 50]}
        >
            <primitive object={clone} />
        </RigidBody>
    );
}

const enemyPartrolProps = [
    {
        name: "Slime",
        waypoints: [
            [-10, 1, 4],
            [-10, 1, 10],
            [0, 1, 10],
            [0, 1, 4],
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
    }
]

interface EnemyEnvironmentProps { }

const EnemyEnvironment: React.FC<EnemyEnvironmentProps> = () => {

    const { axiosFetch } = useAxios();

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

    const [enemyPatrolInScene, setEnemyPatrolInScene] = useState(enemyPartrolProps);

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
                    {currentCamera === 2 && (
                        <PerspectiveCamera makeDefault position={[0, 6, 10]} />
                    )}
                    <OrbitControls />
                    <color attach="background" args={["#000000"]} />
                    <ambientLight intensity={0.8} />
                    <Suspense fallback={null}>
                        <Physics debug={debug} gravity={[0, -9.81, 0]}>
                            {/* <CharacterController /> */}

                            <Floor />

                            {enemyPatrolInScene.map((enemyPartrolProp, index) => (
                                <EnemyPatrolController
                                    key={index}
                                    name={enemyPartrolProp.name}
                                    waypoints={enemyPartrolProp.waypoints}
                                    angle={enemyPartrolProp.angle}
                                    idleTime={enemyPartrolProp.idleTime}
                                    chaseTimeLimit={enemyPartrolProp.chaseTimeLimit}
                                    patrolType={enemyPartrolProp.patrolType}
                                    showPath={enemyPartrolProp.showPath}
                                    data={enemyPartrolProp.data}
                                    setEnemyPatrolInScene={setEnemyPatrolInScene}
                                />
                            ))}

                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </>
    );
};

export default EnemyEnvironment;