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
  Box,
  CameraControls,
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, vec3 } from "@react-three/rapier";
import SceneObject from "../scene-object/SceneObject";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import io from "socket.io-client";
import CharacterControllerOnline from "../../../controllers/CharacterControllerOnline";
import { ref } from "yup";
import { degreeNumberToRadian } from "../../../utils";
import { FaRegClock, FaRegQuestionCircle, FaUserFriends } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import SlotCounter, { SlotCounterRef } from "react-slot-counter";
import GlobalGameUI from "../../../components/ui/GlobalGameUI";
import TrainAIComputerUI from "../ui/TrainAIComputerUI";
import LootBoxUI from "../ui/LootBoxUI";

const item1 = "https://cdn-icons-png.flaticon.com/512/17317/17317789.png";
const item2 = "https://cdn-icons-png.flaticon.com/512/6707/6707083.png";
const item3 = "https://cdn-icons-png.flaticon.com/512/7198/7198581.png";
const item4 = "https://cdn-icons-png.flaticon.com/512/16765/16765728.png";

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
  const images = [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Collage_of_Nine_Dogs.jpg",
      label: "Dog",
    },
    {
      url: "https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg",
      label: "Dog",
    },
    {
      url: "https://www.healthypawspetinsurance.com/Images/V3/DogAndPuppyInsurance/Dog_CTA_Desktop_HeroImage.jpg",
      label: "Dog",
    },
    {
      url: "https://s7d1.scene7.com/is/image/PETCO/puppy-090517-dog-featured-355w-200h-d",
      label: "Dog",
    },
    {
      url: "https://s7d2.scene7.com/is/image/PetSmart/SV0401_CATEGORY_HERO-Dog-Dog-20160818?$SV0401$",
      label: "Dog",
    },
    {
      url: "https://i.ytimg.com/vi/ZgE-ZRvlIlk/maxresdefault.jpg",
      label: "Dog",
    },
    {
      url: "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2017_17/1210958/23-year-old-dog-today-170428-tease.jpg",
      label: "Dog",
    },
    {
      url: "http://www.dogster.com/wp-content/uploads/2017/11/A-retriever-dog-licking-his-lips-and-eating.jpg",
      label: "Dog",
    },
    {
      url: "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/9/11/enhanced/buzzfeed-prod-fastlane-02/enhanced-1731-1502293831-8.jpg?downsize=715:*&output-format=auto&output-quality=auto",
      label: "Dog",
    },
    {
      url: "https://www.rspca.org.uk/webContent/staticImages/SectionImages/Dogs.jpg",
      label: "Dog",
    },
    {
      url: "https://static.boredpanda.com/blog/wp-content/uploads/2018/04/5acb63d83493f__700-png.jpg",
      label: "Cat",
    },
    {
      url: "https://www.argospetinsurance.co.uk/assets/uploads/2017/12/cat-pet-animal-domestic-104827.jpeg",
      label: "Cat",
    },
    {
      url: "http://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg",
      label: "Cat",
    },
    {
      url: "https://www.cats.org.uk/uploads/images/featurebox_sidebar_kids/grief-and-loss.jpg",
      label: "Cat",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
      label: "Cat",
    },
    {
      url: "https://www.petmd.com/sites/default/files/petmd-cat-happy-13.jpg",
      label: "Cat",
    },
    {
      url: "https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&h=350",
      label: "Cat",
    },
    {
      url: "https://www.telegraph.co.uk/content/dam/pets/2017/01/06/1-JS117202740-yana-two-face-cat-news_trans_NvBQzQNjv4BqJNqHJA5DVIMqgv_1zKR2kxRY9bnFVTp4QZlQjJfe6H0.jpg?imwidth=450%27",
      label: "Cat",
    },
  ];

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const { roomId } = useParams<{ roomId: string }>();
  const [userId, setUserId] = useState<string>("");
  const { user } = useAuth();
  const { debug, currentCamera } = useContext(GameContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const playerRefs = useRef({});
  const [isFetchedPlayer, setIsFetchedPlayer] = useState<boolean>(false);
  const waitingCameraPointer = useRef();

  const waitingPositionRef1 = useRef();
  const waitingPositionRef2 = useRef();
  const waitingPositionRef3 = useRef();

  // const debugState = true;
  // const [startGame, setStartGame] = useState<boolean>(false);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [isRandomPuzzle, setIsRandomPuzzle] = useState<boolean>(false);
  const [isOpenComputer, setIsOpenComputer] = useState<boolean>(false);
  const [isOpenLoot, setIsOpenLoot] = useState<boolean>(false);

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

  const maxPlayers = 3;
  const playerSlots = [
    ...players,
    ...Array(maxPlayers - players.length).fill(null),
  ];

  // const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    socket.emit("get_players", { roomId });
    setIsFetchedPlayer(true);
  }, []);

  useEffect(() => {
    if (roomId) {
      const fakeId = Math.random().toString(36).substring(7);
      setUserId(fakeId);

      const userData = {
        userId: fakeId,
      };

      console.log(userData);

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

      socket.on("player_ready_status", ({ userId, isReady }) => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.userId === userId ? { ...player, isReady } : player
          )
        );
      });

      socket.on("random_puzzle", () => {
        console.log("game start");
        setIsRandomPuzzle(true);
      });

      return () => {
        socket.emit("leaveRoom", { message: "goodbye" });
        socket.off("player_updated");
        socket.off("player_ready_status");
        socket.disconnect();
      };
    }
  }, [roomId, isFetchedPlayer]);

  // console.log(players);
  const handleReady = (playerId) => {
    const socket = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.emit("player_ready", { roomId, playerId });
  };

  const handleReadyCancel = (playerId) => {
    const socket = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.emit("player_ready_cancel", { roomId, playerId });
  };

  const [countdown, setCountdown] = useState(3);
  const [showMission, setShowMission] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const counterRef = useRef<SlotCounterRef>(null);
  useEffect(() => {
    if (isRandomPuzzle) {
      counterRef.current?.startAnimation({
        duration: 3,
        dummyCharacterCount: 4,
        direction: "top-down",
      });

      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(interval);
            setShowMission(true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
  }, [isRandomPuzzle]);

  const handleOkay = () => {
    // setIsRandomPuzzle(false);
    // setShowMission(false);
    setIsPlaying(true);
    setStartGame(true);
  };

  const [remainingTime, setRemainingTime] = useState(0);
  const maxTime = 300; // Maximum time for the progress bar

  useEffect(() => {
    if (showMission) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime >= maxTime) {
            clearInterval(timerInterval);
            return maxTime;
          }
          return prevTime + 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [showMission]);

  const progressBarWidth = (remainingTime / maxTime) * 100;
  const [isDuelTime, setIsDuelTime] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [playerPredictions, setPlayerPredictions] = useState([]);
  const [predictionResults, setPredictionResults] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundImages, setRoundImages] = useState([]);
  const [playerPoints, setPlayerPoints] = useState(
    Array(playerSlots.length).fill(0)
  );

  useEffect(() => {
    const shuffledImages = shuffleArray([...images]);
    setRoundImages(shuffledImages.slice(0, 8));
  }, []);

  const generateRandomPrediction = () => (Math.random() > 0.5 ? "Dog" : "Cat");
  // console.log(currentRound);
  // console.log(roundImages);

  const startNewRound = () => {
    if (currentRound < roundImages.length) {
      const newCorrectAnswer = roundImages[currentRound].label;
      setCorrectAnswer(newCorrectAnswer);

      const newPlayerPredictions = playerSlots.map((player) =>
        player ? generateRandomPrediction() : null
      );
      setPlayerPredictions(newPlayerPredictions);

      // Check predictions after 1.5 seconds
      setTimeout(() => {
        const newPredictionResults = newPlayerPredictions.map(
          (prediction) => prediction === newCorrectAnswer
        );
        setPredictionResults(newPredictionResults);
        setPlayerPoints((prevPoints) =>
          prevPoints.map((points, index) =>
            newPredictionResults[index] ? points + 1 : points
          )
        );

        // Move to the next round after 3 seconds total
        setTimeout(() => {
          setCurrentRound((prevRound) => prevRound + 1);
          setPredictionResults([]); // Reset prediction results for the next round
        }, 1500);
      }, 1500);
    }
  };

  // Start the duel automatically when isDuelTime is true
  useEffect(() => {
    if (isDuelTime) {
      startNewRound();
    }
  }, [isDuelTime, currentRound]);

  return (
    <>
      {isOpenLoot && (
        <LootBoxUI isOpenLoot={isOpenLoot} setIsOpenLoot={setIsOpenLoot} />
      )}

      {isDuelTime && (
        <>
          <div
            className="absolute w-fit bg-cyan-400/50 border-2 rounded-xl h-fit z-50 top-10
          left-1/2 transform -translate-x-1/2 pt-2 pl-3 pr-4 pb-2 gap-x-3 flex flex-col"
          >
            <p className="text-2xl text-slate-200 font-semibold text-center mb-2">
              Mission 1: AI Classify Cat or Dog Image
            </p>
            <div className="flex flex-col gap-y-2">
              {currentRound > 7 &&
                playerSlots.map((player, index) => (
                  <div key={index}>
                    {player && (
                      <div>
                        <div
                          className="w-full bg-white/50 px-4 py-2 rounded-xl border-2 text-center 
            text-slate-600 text-xl flex justify-between"
                        >
                          <p>{player.userId}</p>
                          <p>{playerPoints[index]} Point</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {currentRound < roundImages.length && (
              <div className="w-full h-[25vh]">
                <img
                  src={roundImages[currentRound]?.url}
                  alt={correctAnswer}
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            )}
          </div>
          <div
            className="absolute w-[90%] bg-cyan-400/50 border-2 rounded-xl h-[15vh] z-50 bottom-20 
          left-1/2 transform -translate-x-1/2 pt-3 px-4 pb-4 grid grid-cols-3 gap-x-3"
          >
            {playerSlots.map((player, index) => (
              <div key={index}>
                {player ? (
                  <div>
                    <div
                      className="w-full bg-white/50 px-4 py-2 rounded-xl border-2 text-center 
            text-slate-600 text-xl"
                    >
                      {player.userId} - {playerPoints[index]} Point
                    </div>
                    <div
                      className={`w-full mt-2 py-2.5 rounded-xl border-2 text-center text-xl 
                    ${
                      predictionResults[index] === true
                        ? "bg-green-500 text-white"
                        : predictionResults[index] === false
                        ? "bg-red-500 text-white"
                        : "bg-white/50 text-slate-600"
                    }`}
                    >
                      Predict: {playerPredictions[index]}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-full bg-white/50 px-4 py-3 rounded-xl border-2 text-center 
                    text-slate-600 text-xl"
                    >
                      Empty
                    </div>
                    <div className="mt-2 flex gap-x-2">
                      <div className="w-full bg-white/50 border-2 rounded-lg text-center py-1">
                        There's no player available in slot
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div>
        {isRandomPuzzle && !isDuelTime && (
          <div className="absolute w-[96%] h-4 z-[9999] bg-white left-1/2 transform -translate-x-1/2 top-4 border-2 rounded-md">
            <div className="relative h-full w-full rounded-md">
              <div
                className="absolute h-full bg-cyan-400 rounded-l-md transition-all ease-linear duration-200"
                style={{ width: `${Math.min(progressBarWidth, 33.33)}%` }}
              ></div>
              <div
                className="absolute h-full bg-yellow-400 transition-all ease-linear duration-200"
                style={{
                  left: "33.33%",
                  width: `${Math.min(
                    Math.max(progressBarWidth - 33.33, 0),
                    33.33
                  )}%`,
                }}
              ></div>
              <div
                className="absolute h-full bg-red-400 rounded-r-md transition-all ease-linear duration-200"
                style={{
                  left: "66.66%",
                  width: `${Math.min(
                    Math.max(progressBarWidth - 66.66, 0),
                    33.33
                  )}%`,
                }}
              ></div>
            </div>
            <div className="absolute left-3/4 transform -translate-x-1/2 text-white text-lg top-6">
              Deploy
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg top-6">
              Train & Test
            </div>
            <div className="absolute left-1/4 transform -translate-x-1/2 text-white text-lg top-6">
              Data Preparation
            </div>
          </div>
        )}
      </div>
      {/* <GlobalGameUI /> */}
      {isOpenComputer && (
        <TrainAIComputerUI
          isOpenComputer={isOpenComputer}
          setIsOpenComputer={setIsOpenComputer}
        />
      )}
      {isRandomPuzzle && !startGame && (
        <div className="absolute w-full max-w-3xl bg-cyan-400/50 border-2 rounded-xl h-fit pb-3 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-2 pl-3 pr-4 gap-x-3 flex flex-col">
          <p className="text-3xl text-slate-200 font-semibold mb-auto text-center mt-2">
            Random AI Development Mission
          </p>
          <div className="bg-white/70 rounded-lg border-2 px-2 justify-center flex mt-2 mb-auto">
            <div className="my-auto pb-2.5">
              <SlotCounter
                autoAnimationStart={false}
                containerClassName="h-32"
                ref={counterRef}
                startValue={[
                  <img className="w-32 h-32 mx-4" src={item2} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item2} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item2} alt="" />,
                ]}
                value={[
                  <img className="w-32 h-32 mx-4" src={item1} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item3} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item4} alt="" />,
                ]}
                dummyCharacters={[
                  <img className="w-32 h-32 mx-4" src={item1} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item2} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item3} alt="" />,
                  <img className="w-32 h-32 mx-4" src={item4} alt="" />,
                ]}
              />
            </div>
          </div>
          {showMission && (
            <>
              <p className="text-2xl mt-2 text-slate-200 font-semibold tracking-wide">
                Mission
              </p>
              <div className="mt-1 flex flex-col gap-y-2">
                <div className="w-full bg-cyan-200 px-2.5 py-2 border rounded-lg text-slate-500 flex">
                  <img className="w-1" src={item1} alt="" />
                  <p className="ml-2 text-xl">
                    Mission 1: Develop a AI to classify the images
                    <br />{" "}
                    <span className="text-sm">
                      Using Convulutional Neural Network Model (CNN)
                    </span>
                  </p>
                </div>
                <div className="w-full bg-cyan-200 px-2.5 py-2 border rounded-lg text-slate-500 flex">
                  <img className="w-1" src={item3} alt="" />
                  <p className="ml-2 text-xl">
                    Mission 2: Develop a AI to solve Maze in 45 seconds
                    <br />{" "}
                    <span className="text-sm">
                      Using Reinforcement Learning Model (RL)
                    </span>
                  </p>
                </div>
                <div className="w-full bg-cyan-200 px-2.5 py-2 border rounded-lg text-slate-500 flex">
                  <img className="w-1" src={item4} alt="" />
                  <p className="ml-2 text-xl">
                    Mission 3: Develop a AI to recognize the unseen character
                    <br />{" "}
                    <span className="text-sm">
                      Using Recurrent Neural Network Model (RNN)
                    </span>
                  </p>
                </div>
                <button
                  className="mt-2 bg-cyan-500 w-fit px-3 py-2 border rounded-lg font-semibold text-slate-600"
                  onClick={handleOkay}
                >
                  OK, Let's Start
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {!isRandomPuzzle && !isPlaying && !isDuelTime && (
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
            {playerSlots.map((player, index) => (
              <div key={index}>
                {player ? (
                  <div>
                    <div
                      className="w-full bg-white/50 px-4 py-2 rounded-xl border-2 text-center 
                text-slate-600 text-xl"
                    >
                      {player.userId}
                    </div>
                    {player.userId === userId ? (
                      player.isReady ? (
                        <div className="mt-2 flex gap-x-2">
                          <button
                            disabled
                            className="bg-blue-400 border-4 border-blue-600 w-2/3 px-3 py-2 font-semibold 
                  text-white rounded-lg text-xl"
                            style={{
                              textShadow: "1px 1px 0 black",
                            }}
                          >
                            READY
                          </button>
                          <button
                            onClick={() => handleReadyCancel(player.userId)}
                            className="bg-red-300 border-4 border-red-500 w-1/3 px-3 py-2 font-semibold 
                  text-white rounded-lg text-xl"
                            style={{
                              textShadow: "1px 1px 0 black",
                            }}
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 flex gap-x-2">
                          <button
                            onClick={() => handleReady(player.userId)}
                            className="bg-green-400 border-4 border-green-600 w-1/2 px-3 py-2 font-semibold 
                  text-white rounded-lg text-xl"
                            style={{
                              textShadow: "1px 1px 0 black",
                            }}
                          >
                            READY
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
                      )
                    ) : player.isReady ? (
                      <div className="mt-2 flex gap-x-2">
                        {
                          <button
                            disabled
                            className="bg-blue-200 w-full border-4 border-blue-400 px-3 py-2 font-semibold 
                text-white rounded-lg text-xl"
                            style={{
                              textShadow: "1px 1px 0 black",
                            }}
                          >
                            READY
                          </button>
                        }
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-x-2">
                        {
                          <button
                            disabled
                            className="bg-orange-200 w-full border-4 border-orange-400 px-3 py-2 font-semibold 
                text-white rounded-lg text-xl"
                            style={{
                              textShadow: "1px 1px 0 black",
                            }}
                          >
                            NOT READY
                          </button>
                        }
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-full bg-white/50 px-4 py-3 rounded-xl border-2 text-center 
                text-slate-600 text-xl"
                    >
                      Waiting for other player
                    </div>
                    <div className="mt-2 flex gap-x-2">
                      <div className="w-full bg-white/50 border-2 rounded-lg text-center py-1">
                        ...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
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
                waitingCameraPointer={waitingCameraPointer}
                players={players}
                isOpenComputer={isOpenComputer}
                setIsOpenComputer={setIsOpenComputer}
                isOpenLoot={isOpenLoot}
                setIsOpenLoot={setIsOpenLoot}
                isDuelTime={isDuelTime}
                setIsDuelTime={setIsDuelTime}
              />

              <RigidBody
                ref={waitingCameraPointer}
                colliders={false}
                type="fixed"
                position={[-14, 4, -20]}
              >
                <Box args={[10, 10, 10]} visible={false} />
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default OnlineGame1;
