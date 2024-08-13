import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameContext } from "../../../contexts/GameContext";
import {
  Controls,
} from "../../../controllers/CharacterController";
import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import SceneObject from "../scene-object/SceneObject";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import io from "socket.io-client";
import CharacterControllerOnline from "../../../controllers/CharacterControllerOnline";

// const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT as string;
const serverEndpoint = "http://localhost:3001";
const socket = io(serverEndpoint, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

type Props = {};

type Player = {
  userId: string;
  position: [number, number, number];
  direction: [number, number, number];
  animation: string;
};

const OnlineGame1: React.FC<Props> = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [userId, setUserId] = useState<string>("");
  console.log(roomId);
  const { user } = useAuth();
  const { debug, currentCamera } = useContext(GameContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const playerRefs = useRef({});

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
    if (roomId) {
      const fakeId = Math.random().toString(36).substring(7);
      console.log(fakeId);
      setUserId(fakeId);
      const randomPosition = [
        Math.floor(Math.random() * 23) - 20,
        4,
        Math.floor(Math.random() * 25) - 14
      ];
  
      const userData = {
        userId: fakeId,
        position: randomPosition,
        direction: "right",
        animation: "Idle",
      };
  
      const socket = io("http://localhost:3001", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socket.emit("join_room1", { message: "hello", roomId, userData });
  
      socket.on("existing_players", (existingPlayers) => {
        console.log("Existing players:", existingPlayers);
        setPlayers(existingPlayers);
        existingPlayers.forEach(player => {
          playerRefs.current[player.userId] = React.createRef();
        });
      });
  
      socket.on("new_player", (newPlayerData) => {
        console.log("New player joined:", newPlayerData);
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers, newPlayerData];
          playerRefs.current[newPlayerData.userId] = React.createRef();
          return updatedPlayers;
        });
      });

      socket.on("player_updated", (updatedPlayerData) => {
        console.log("Player updated:", updatedPlayerData.position);
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.userId === updatedPlayerData.userId
              ? updatedPlayerData
              : player
          )
        );
      });
  
      socket.on("player_left", ({ userId }) => {
        console.log("Player left:", userId);
        setPlayers((prevPlayers) => {
          const updatedPlayers = prevPlayers.filter((player) => player.userId !== userId);
          delete playerRefs.current[userId];
          return updatedPlayers;
        });
      });
  
      return () => {
        socket.emit("leaveRoom", { message: "goodbye" });
        socket.disconnect();
      };
    }
  }, [roomId]);

  console.log(players);

  return (
    <>
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          <color attach="background" args={["black"]} />
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          <ambientLight intensity={0.5} color={"lightblue"} />

          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              {
                players.map((player) => (
                  <CharacterControllerOnline
                    key={player.userId}
                    spawnPosition={player.position}
                    isSelf={player.userId === userId}
                    userId={player.userId}
                    roomId={roomId}
                    socket={socket}
                    isOnline={true}
                    onlinePosition={player.position}
                    playerRigidBody={playerRefs.current[player.userId]}
                    players={players}
                  />
                ))
              }
              <SceneObject />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default OnlineGame1;
