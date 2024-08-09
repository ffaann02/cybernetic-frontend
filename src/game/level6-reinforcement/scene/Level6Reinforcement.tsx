import React, { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import { GameContext } from '../../../contexts/GameContext';
import CharacterController, { Controls } from '../../../controllers/CharacterController';
import { KeyboardControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Level6Environment } from '../scene-object/Level6-Environment';
import { useLevel6Context } from '../../../contexts/SceneContext/Level6Context';
import useAxios from '../../../hooks/useAxios';
import axiosInstanceAiService from '../../../api/aiService';
import ComputerMazeSolverUI from '../ui/ComputerMazeSolverUI';
import CameraMazeSolverUI from '../ui/CameraMazeSolverUI';
import { useAuth } from '../../../hooks/useAuth';
import MazeTrainingModal from '../ui/MazeTrainingModal';

type Props = {}

const Level6Reinforcement: React.FC<Props> = () => {

    const { user } = useAuth();
    const { debug, currentCamera } = useContext(GameContext);
    const {
        mazeGeneratedPattern,
        setMazeGeneratedPattern,
        mazeStateDetail,
        setMazeStateDetail,
        mazeSolverParameter,
        setTrainingProgress,
        setIsTraining,
        setIsDisplayTrainingModal,
        setTrainingCurrentEpisode,
        setTrainingReward,
    } = useLevel6Context();
    const { axiosFetch } = useAxios();

    let socket: WebSocket;

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

    useEffect(() => {
        generateMaze();
    }, [])

    const generateMaze = async () => {
        try {
            console.log("Init Maze")
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: "/maze/init"
            })
            const { state, action, reward, done, maze } = response
            setMazeGeneratedPattern(maze)
            const mazeState = {
                state: state,
                action: action,
                reward: reward,
                done: done
            }
            setMazeStateDetail(mazeState)
            console.log(mazeState)
        } catch (error) {
            console.log(error)
        }
    }

    const trainMazeSolver = async () => {
        try {
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: "/maze/train",
                requestConfig: {
                    userId: user?.userId,
                    maze: mazeGeneratedPattern,
                    episodes: mazeSolverParameter.episodes,
                    alpha: mazeSolverParameter.alpha,
                    gamma: mazeSolverParameter.gamma,
                    epsilon: mazeSolverParameter.epsilon,
                }
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const stepMaze = async () => {
        try {
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: "/maze/step",
                requestConfig: {
                    userId: user?.userId,
                    state: mazeStateDetail.state,
                    maze: mazeGeneratedPattern
                }
            })
            console.log(response.state)
            setMazeStateDetail({
                state: response.state,
                action: response.action,
                reward: response.reward,
                done: response.done
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleTrainMazeSolver = () => {
        socket = new WebSocket('ws://localhost:8000/ws/train');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            // Send a message to start training
            const data = {
                message: 'train',
                userId: user?.userId,
                maze: mazeGeneratedPattern,
                episodes: mazeSolverParameter.episodes,
                alpha: mazeSolverParameter.alpha,
                gamma: mazeSolverParameter.gamma,
                epsilon: mazeSolverParameter.epsilon,
            };
            socket.send(JSON.stringify(data));
            setIsTraining(true);
            setIsDisplayTrainingModal(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTrainingProgress(data.progress);
            setTrainingCurrentEpisode(data.episode);
            if(data.episode % 100 === 0) {
                console.log(`Episode: ${data.episode}, Progress: ${data.progress}%, Total Reward: ${data.total_reward}`);
                setTrainingReward((prev) => [...prev, data.total_reward]);
            }
            if (data.progress === 100) {
                console.log('Training complete');
                setIsTraining(false);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    return (
        <>
            <MazeTrainingModal />
            <ComputerMazeSolverUI
                trainMazeSolver={trainMazeSolver}
                handleTrainMazeSolver={handleTrainMazeSolver} />
            <CameraMazeSolverUI />
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
                            <CharacterController spawnPosition={[-28, 2, 35]} />
                            {/* <CharacterController /> */}
                            <Level6Environment
                                generateMaze={generateMaze}
                                stepMaze={stepMaze}
                            />
                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </>
    )
}

export default Level6Reinforcement