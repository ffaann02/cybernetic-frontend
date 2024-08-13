import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameContext } from "../../../contexts/GameContext";
import { Controls } from "../../../controllers/CharacterController";
import {
  CameraControls,
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, vec3 } from "@react-three/rapier";
import SceneObject from "../scene-object/SceneObject";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import io from "socket.io-client";
import CharacterControllerOnline from "../../../controllers/CharacterControllerOnline";
import { ref } from "yup";
import { degreeNumberToRadian } from "../../../utils";
import { FaRegClock, FaRegQuestionCircle, FaUserFriends } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";

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
  const { user } = useAuth();
  const { debug, currentCamera } = useContext(GameContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  const playerRefs = useRef({});

  const waitingPositionRef1 = useRef();
  const waitingPositionRef2 = useRef();
  const waitingPositionRef3 = useRef();

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
        Math.floor(Math.random() * 25) - 14,
      ];

      const join1pos = [-20, 0, -18];
      const join2pos = [-14, 0, -18];
      const join3pos = [-8, 0, -18];


      let initPosition;
      let variant;
      if (players.length - 1 === 0) {
        console.log("join1");
        initPosition = join1pos;
        variant = "blue";
      }
      if (players.length - 1 === 1) {
        console.log("join2");
        initPosition = join2pos;
        variant = "orange";
      }
      if (players.length - 1 === 2) {
        initPosition = join3pos;
        variant = "red";
      }

      const userData = {
        userId: fakeId,
        position: initPosition,
        direction: "right",
        animation: "Idle",
        variant: variant,
      };

      const socket = io("http://localhost:3001", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socket.emit("join_room1", { message: "hello", roomId, userData });

      socket.on("existing_players", (existingPlayers) => {
        console.log("Existing players:", existingPlayers);
        setPlayers(existingPlayers);
        existingPlayers.forEach((player) => {
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
          const updatedPlayers = prevPlayers.filter(
            (player) => player.userId !== userId
          );
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
      <div
        className="absolute w-fit bg-cyan-400/50 border-2 rounded-xl min-h-[10vh] z-50 top-10
        left-1/2 transform -translate-x-1/2 pt-2 pl-3 pr-4 pb-3 gap-x-3 flex flex-col"
      >
        <p className="text-2xl text-slate-200 font-semibold">Room Detail</p>
        <div className="w-full flex gap-x-2 mt-2">
          <div className="flex flex-col border pt-1 p-3 rounded-xl bg-white/20">
            <p className="text-sm text-white -ml-1">Room Code</p>
            <div className="flex">
            <IoIosLink className="text-4xl text-cyan-200 mt-1" />
              <p className="text-xl mt-2 ml-4 font-semibold tracking-wider text-white">
              7sp9dZQ
              </p>
            </div>
          </div>
          <div className="flex flex-col border pt-1 p-3 rounded-xl bg-white/20">
            <p className="text-sm text-white -ml-1">Player</p>
            <div className="flex">
              <FaUserFriends className="text-4xl text-cyan-200 mt-1" />
              <p className="text-xl mt-2 ml-3 font-semibold tracking-wider text-white">
                {players.length}/3
              </p>
            </div>
          </div>
          <div className="flex flex-col border pt-1 p-3 rounded-xl bg-white/20">
            <p className="text-sm text-white -ml-1">Game Mode</p>
            <div className="flex">
              <FaRegQuestionCircle className="text-4xl text-cyan-200 mt-1" />
              <p className="text-xl mt-2 ml-2.5 font-semibold tracking-wider text-white">
                Random
              </p>
            </div>
          </div>
          <div className="flex flex-col border pt-1 p-3 rounded-xl bg-white/20">
            <p className="text-sm text-white -ml-1">Time</p>
            <div className="flex">
              <FaRegClock className="text-4xl text-cyan-200 mt-1" />
              <p className="text-xl mt-2 ml-3 font-semibold tracking-wider text-white whitespace-nowrap">
                8 Minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute w-[90%] bg-cyan-400/50 border-2 rounded-xl h-[15vh] z-50 bottom-20 
        left-1/2 transform -translate-x-1/2 pt-3 px-4 pb-4 grid grid-cols-3 gap-x-3"
      >
        <div>
          <div
            className="w-full bg-white/50 px-4 py-2 rounded-xl border-2 text-center 
         text-slate-600 text-xl"
          >
            ffaann
          </div>
          <div className="mt-2 flex gap-x-2">
            <button
              className="bg-green-400 border-4 border-green-600 w-1/2 px-3 py-2 font-semibold 
            text-white rounded-lg text-xl"
              style={{
                textShadow: "1px 1px 0 black",
              }}
            >
              READEY
            </button>
            <button
              className="bg-red-300 border-4 border-red-500 w-1/2 px-3 py-2 font-semibold 
            text-white rounded-lg text-xl"
              style={{
                textShadow: "1px 1px 0 black",
              }}
            >
              QUIT
            </button>
          </div>
        </div>
        <div>
          <div
            className="w-full bg-white/50 px-4 py-3 rounded-xl border-2 text-center 
         text-slate-600 text-xl"
          >
            Waiting other player
          </div>
          <div className="mt-2 flex gap-x-2">
            <div className="w-full bg-white/50 border-2 rounded-lg text-center py-1">
              ...
            </div>
          </div>
        </div>
      </div>
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          <color attach="background" args={["black"]} />
          <ambientLight intensity={0.5} color={"lightblue"} />
          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              {players.map((player) => (
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
                  startGame={startGame}
                  variant={player.variant}
                />
              ))}
              <SceneObject
                startGame={startGame}
                waitingPositionRef1={waitingPositionRef1}
                waitingPositionRef2={waitingPositionRef2}
                waitingPositionRef3={waitingPositionRef3}
              />
            </Physics>
          </Suspense>
          <OrbitControls/>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default OnlineGame1;
