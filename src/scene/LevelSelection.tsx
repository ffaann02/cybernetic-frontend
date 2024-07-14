import React, { useEffect, useState, Suspense } from 'react';
import useAxios from '../hooks/useAxios';
import axiosInstance from '../api/axios';
import { LevelDetail } from '../contexts/SceneContext/LevelContext';
import { useAuth } from '../hooks/useAuth';
import { ItemWithUrl } from '../components/scene-environments/shared/ItemWithUrl';
import { Canvas, useLoader } from "@react-three/fiber";
import LevelSelectPreview from '../components/ui/level-selection/LevelSelectPreview';
import SmoothCamera from '../controllers/SmoothCamera';
import { TextureLoader } from 'three';
import { ItemWithUrlIdle } from '../components/scene-environments/shared/ItemWIthUrlIdle';

const items = [
    {
        name: "LargeBuilding",
        fileType: "glb",
        position: [0, 0, 0],
        rotation: -2.15,
        scale: [2.5, 2.5, 2.5],
    },
    {
        name: "Floor",
        fileType: "glb",
        position: [0, -1.5, 0],
        rotation: -2.15,
        scale: [10, 2.5, 10],
    },
    {
        name: "HoveTank",
        fileType: "glb",
        position: [2.9, 0, -2],
        rotation: -2.2,
        scale: [2.5, 2.5, 2.5],
    },
    {
        name: "BladeRunnerMemory",
        fileType: "glb",
        position: [3.2, 1.48, 0],
        rotation: -2.2,
        scale: [1, 1, 1],
    },
    {
        name: "BladeRunnerMemory",
        fileType: "glb",
        position: [2.6, 1.48, 0.5],
        rotation: -2.2,
        scale: [1, 1, 1],
    },
    {
        name: "Probodobodyne",
        fileType: "glb",
        position: [5.2, 0, 1.6],
        rotation: -2.2,
        scale: [0.5, 0.5, 0.5],
    },
    {
        name: "GeodesicDome",
        fileType: "glb",
        position: [5.2, 0.5, 1.6],
        rotation: -2.2,
        scale: [0.1, 0.1, 0.1],
    },
    {
        name: "SecurityCamera",
        fileType: "glb",
        position: [-2, 0.95, 1.98],
        rotation: -3.2,
        scale: [0.06, 0.06, 0.06],
    },
    {
        name: "SecurityCamera",
        fileType: "glb",
        position: [1.74, 0.95, 2.6],
        rotation: -2.2,
        scale: [0.06, 0.06, 0.06],
    }
];

const idleItems = [
    {
        name: "Arrow2",
        position: [1.8, 1.5, 2],
        rotationX: 0,
        rotation: -2.2,
        rotationZ: 2,
        scale: [1, 1, 1],
        idleAnimation: true,
        idleSpeed: 3,
        idleAmplitude: 0.05,
        idlePos: 'x',
    }
];

export interface UserLevel {
    userId: string;
    levelPlayed: string[];
}

const LevelSelection: React.FC = () => {

    const { axiosFetch } = useAxios();
    const { user } = useAuth();

    const [levels, setLevels] = useState<LevelDetail[]>([]);
    const [userLevels, setUserLevels] = useState<UserLevel>();
    const [currentLevel, setCurrentLevel] = useState<LevelDetail | null>(null);

    const fetchLevels = async () => {
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'get',
                url: '/game-play/level-selection',
            });
            setLevels(response.gamePlayLevel);
            setCurrentLevel(response.gamePlayLevel[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserLevels = async () => {
        const userId = user?.userId;
        try {
            const response = await axiosFetch({
                axiosInstance,
                method: 'get',
                url: '/user/game-play-level',
                requestConfig: {
                    params: { userId: userId },
                },
            });
            setUserLevels(response.userGamePlayLevel);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchLevels();
        fetchUserLevels();
    }, []);

    const cameraPosX = 3;
    const cameraPosY = [0, 1.5, 2.5, 3.5, 4.5]
    const cameraPosZ = 8;

    const areaLightPosX = -0.25;
    const areaLightPosY = [0, 1.48, 2.48, 3.48, 4.48]
    const areaLightPosZ = 2.4;

    // Add this inside your component or as a separate hook if needed
    const backgroundTexture = useLoader(TextureLoader, '/images/sky.jpg');

    return (
        <>
            <Canvas
                dpr={[1, 2]}
                style={{ height: "100%", width: "100%" }}
                shadows
                className="z-0">
                {currentLevel &&
                    <>
                        <SmoothCamera targetPosition={[cameraPosX, cameraPosY[currentLevel.levelNumber], cameraPosZ]} />
                        <rectAreaLight
                            // intensity={50}
                            intensity={30}
                            width={20}
                            height={0.15}
                            color="#083bb2"
                            // color="#ffffff"
                            // rotation={[(6 * Math.PI) / 2, 16, 0]}
                            rotation={[(6 * Math.PI) / 2, 15.84, 0]}
                            position={[areaLightPosX, areaLightPosY[currentLevel.levelNumber], areaLightPosZ]} />
                    </>
                }
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 4, 0]} intensity={0.2} />
                <Suspense fallback={null}>
                    {/* <Environment files="/images/sky.jpg" background /> */}
                    <mesh scale={[1.5, 1.5, 1.5]} position={[0, 0, -20]}> {/* Adjust the scale to zoom in or out */}
                        <planeGeometry attach="geometry" args={[50, 50]} /> {/* Adjust args for aspect ratio */}
                        <meshBasicMaterial attach="material" map={backgroundTexture} />
                    </mesh>
                    {items.map((item, index) => (
                        <ItemWithUrl
                            key={index}
                            item={item}
                            sceneName='level-selection'/>
                    ))}
                    {currentLevel && idleItems.map((item, index) => (
                        <ItemWithUrlIdle
                            key={index}
                            item={item}
                            sceneName='level-selection'
                            isMovePosY={true}
                            arrayOfPosY={cameraPosY}
                            IndexOfArray={currentLevel.levelNumber} />
                    ))}
                </Suspense>
            </Canvas>
            {currentLevel && userLevels &&
                <LevelSelectPreview
                    levels={levels}
                    currentLevel={currentLevel}
                    setCurrentLevel={setCurrentLevel}
                    userLevels={userLevels} />
            }
        </>
    );
};

export default LevelSelection;
