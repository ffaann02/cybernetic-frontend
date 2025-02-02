import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { Controls } from "../controllers/CharacterController";
import * as THREE from "three";
import useAxios from "../hooks/useAxios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import axiosInstance from "../api/axios";

export interface InventoryData {
  id: number;
  name: string;
  quantity: number;
  image: string;
  data: any;
  timestamp: number; // Add a timestamp to track when the item was added
}

interface GameContextProps {
  currentScene: string;
  previousScene: string;
  speed: number;
  debug: boolean;
  setGameState?:
  | React.Dispatch<React.SetStateAction<GameContextProps>>
  | undefined;
  setScene?: (currentScene: string, nextScene: string) => void;
  sceneList: string[];
  currentCamera: number;
  cameraList: number[];
  currentHit?: string;
  setCurrentHit?: React.Dispatch<React.SetStateAction<string>>;
  isCoding?: boolean;
  isInteracting?: boolean;
  setIsCoding: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInteracting: React.Dispatch<React.SetStateAction<boolean>>;
  isChatting?: boolean;
  setIsChatting?: React.Dispatch<React.SetStateAction<boolean>>;
  isHidden?: boolean;
  setIsHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  isUsingSearch?: boolean;
  setIsUsingSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  isPlanting?: boolean;
  setIsPlanting?: React.Dispatch<React.SetStateAction<boolean>>;
  dataStorage?: any;
  setDataStorage?: React.Dispatch<React.SetStateAction<any>>;
  mines?: any;
  setMines?: React.Dispatch<React.SetStateAction<any>>;
  cooldowns?: any;
  setCooldowns?: React.Dispatch<React.SetStateAction<any>>;
  playerRigidBody?: React.RefObject<any>;
  isFadingBetweenRoom?: boolean;
  setIsFadingBetweenRoom?: React.Dispatch<React.SetStateAction<boolean>>;
  isUsingSecurityCamera?: boolean;
  setIsUsingSecurityCamera?: React.Dispatch<React.SetStateAction<boolean>>;
  isCarryingObject?: boolean;
  setIsCarryingObject?: React.Dispatch<React.SetStateAction<boolean>>;
  isUsingTurret?: boolean;
  setIsUsingTurret?: React.Dispatch<React.SetStateAction<boolean>>;
  turretData?: any;
  setTurretData?: React.Dispatch<React.SetStateAction<any>>;
  isPlayerInBossArea?: boolean;
  setIsPlayerInBossArea?: React.Dispatch<React.SetStateAction<boolean>>;
  bossParameter?: any;
  setBossParameter?: React.Dispatch<React.SetStateAction<any>>;
  energy: number;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  isDeath: boolean;
  setIsDeath: React.Dispatch<React.SetStateAction<boolean>>;
  controlMap: { name: string; keys: string[] }[];
  isEnemyHit?: boolean;
  setIsEnemyHit?: React.Dispatch<React.SetStateAction<boolean>>;
  enemyHitName?: string;
  setEnemyHitName?: React.Dispatch<React.SetStateAction<string>>;
  searchDataNotify: React.RefObject<any>;
  showStar: boolean;
  setShowStar: React.Dispatch<React.SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  isShowLevelResult: boolean;
  setIsShowLevelResult: React.Dispatch<React.SetStateAction<boolean>>;
  searchAimDirection?: any;
  searchResult?: any;
  setSearchResult?: React.Dispatch<React.SetStateAction<any>>;
  isOpenInventory: boolean;
  setIsOpenInventory: React.Dispatch<React.SetStateAction<boolean>>;
  inventoryItem: InventoryData[];
  setInventoryItem: React.Dispatch<React.SetStateAction<InventoryData[]>>;
  inventoryType: { name: string, value: string }[];
  inventoryData: InventoryData[];
  setInventoryData: React.Dispatch<React.SetStateAction<InventoryData[]>>;
  playTimeInLevel: number;
  setPlayTimeInLevel: React.Dispatch<React.SetStateAction<number>>;
}

const initialGameContext: GameContextProps = {
  // currentScene: "tutorial",
  currentScene: "game-level-4",
  previousScene: "level-selection",
  speed: 7.5,
  debug: false,
  sceneList: [
    "home",
    "tutorial",
    "test",
    "welcome",
    "enemy-environment",
    "level-selection",
    "game-level-1",
    "game-level-2",
    "game-level-3",
    "game-level-4",
    "game-level-5",
    "game-level-6",
    "slime-lab",
    "online-game1",
  ],
  currentCamera: 1,
  cameraList: [1, 2, 3],
  currentHit: "",
  isCoding: false,
  isInteracting: false,
  setIsCoding: () => { },
  setIsInteracting: () => { },
  isChatting: false,
  setIsChatting: () => { },
  isHidden: false,
  setIsHidden: () => { },
  isUsingSearch: false,
  setIsUsingSearch: () => { },
  isPlanting: false,
  setIsPlanting: () => { },
  dataStorage: {},
  setDataStorage: () => { },
  mines: [],
  setMines: () => { },
  cooldowns: { J: 0, K: 0, L: 0 },
  setCooldowns: () => { },
  isFadingBetweenRoom: false,
  setIsFadingBetweenRoom: () => { },
  isUsingSecurityCamera: false,
  setIsUsingSecurityCamera: () => { },
  turretData: {},
  setTurretData: () => { },
  isCarryingObject: false,
  playerRigidBody: null,
  setIsCarryingObject: () => { },
  energy: 10,
  setEnergy: () => { },
  isDeath: false,
  setIsDeath: () => { },
  isUsingTurret: false,
  setIsUsingTurret: () => { },
  isPlayerInBossArea: false,
  setIsPlayerInBossArea: () => { },
  bossParameter: {},
  setBossParameter: () => { },
  isEnemyHit: false,
  setIsEnemyHit: () => { },
  enemyHitName: "",
  setEnemyHitName: () => { },
  controlMap: [],
  showStar: false,
  setShowStar: () => { },
  isPaused: false,
  setIsPaused: () => { },
  isShowLevelResult: false,
  setIsShowLevelResult: () => { },
};

export const GameContext = createContext<GameContextProps>(initialGameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
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
  const [gameState, setGameState] =
    useState<GameContextProps>(initialGameContext);
  const [currentHit, setCurrentHit] = useState<string>("");
  const [isCoding, setIsCoding] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isUsingSearch, setIsUsingSearch] = useState<boolean>(false);
  const [isPlanting, setIsPlanting] = useState<boolean>(false);
  const [dataStorage, setDataStorage] = useState<any>({});
  const [mines, setMines] = useState<any>([]);
  const [cooldowns, setCooldowns] = useState({ J: 0, K: 0, L: 0 });
  const [isFadingBetweenRoom, setIsFadingBetweenRoom] =
    useState<boolean>(false);
  const [isUsingSecurityCamera, setIsUsingSecurityCamera] =
    useState<boolean>(false);
  const [isCarryingObject, setIsCarryingObject] = useState(false);
  const [isUsingTurret, setIsUsingTurret] = useState<boolean>(false);
  const [turretData, setTurretData] = useState<any>({});
  const [isPlayerInBossArea, setIsPlayerInBossArea] = useState<boolean>(false);
  const [bossParameter, setBossParameter] = useState<any>({});
  const playerRigidBody = useRef<any>(null);
  const [energy, setEnergy] = useState(10);
  const [isDeath, setIsDeath] = useState(false);
  const [isEnemyHit, setIsEnemyHit] = useState<boolean>(false);
  const [enemyHitName, setEnemyHitName] = useState<string>("");
  const searchDataNotify = useRef(null);
  const [showStar, setShowStar] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isShowLevelResult, setIsShowLevelResult] = useState(false);
  const searchAimDirection = useRef(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isOpenInventory, setIsOpenInventory] = useState(false);
  const [inventoryType, setInventoryType] = useState<{ name: string, value: string }[]>([
    { name: "Item", value: "item" },
    { name: "Data", value: "data" },
  ]);
  const initItems: Array<InventoryData | null> = [
    {
      id: 1,
      name: "Invisible suit",
      quantity: 12,
      image: "https://cdn-icons-png.flaticon.com/512/5102/5102093.png",
      data: null,
      timestamp: Date.now(),
    },
    {
      id: 2,
      name: "Frantic search",
      quantity: 11,
      image: "https://cdn-icons-png.flaticon.com/512/639/639375.png",
      data: null,
      timestamp: Date.now(),
    },
    {
      id: 3,
      name: "Landmine bomber",
      quantity: 13,
      image: "https://cdn-icons-png.flaticon.com/512/4612/4612069.png",
      data: null,
      timestamp: Date.now(),
    },
  ];
  const initialInventoryItem = [...initItems, ...Array(15).fill(null)];
  const [inventoryItem, setInventoryItem] = useState<Array<InventoryData[] | null>>(initialInventoryItem);
  const [inventoryData, setInventoryData] = useState<Array<InventoryData[] | null>>(
    Array(36).fill(null)
  );
  const [playTimeInLevel, setPlayTimeInLevel] = useState<number>(0);

  const { axiosFetch } = useAxios();
  const { getItem } = useLocalStorage();
  const localStorageUser = getItem('CYBERNETIC_USER')
  const userId = localStorageUser?.userId;

  const setScene = (currentScene: string, nextScene: string) => {
    setGameState((prevState) => ({
      ...prevState,
      currentScene: nextScene,
      previousScene: currentScene,
    }));
  };

  useEffect(() => {
    if (energy <= 0 && !isDeath) {
      console.log("death");
      setIsDeath(true);
    }
  }, [energy, isDeath])

  const getUserLevelCheckpoint = async() => {
    try{
      const response = await axiosFetch({
        axiosInstance: axiosInstance,
        url: `/user/character?userId=${userId}`,
        method: 'get',
      })
      const spawnLevel = response.character.heighestLevel;
      console.log(spawnLevel);
      setScene(gameState.currentScene, `game-level-${spawnLevel}`);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserLevelCheckpoint();
  }, [])

  const value = {
    currentScene: gameState.currentScene,
    previousScene: gameState.previousScene,
    speed: gameState.speed,
    debug: gameState.debug,
    sceneList: gameState.sceneList,
    currentCamera: gameState.currentCamera,
    cameraList: gameState.cameraList,
    playerRigidBody,
    setGameState,
    currentHit,
    setCurrentHit,
    isCoding,
    setIsCoding,
    isInteracting,
    setIsInteracting,
    setScene,
    isChatting,
    setIsChatting,
    isHidden,
    setIsHidden,
    isUsingSearch,
    setIsUsingSearch,
    isPlanting,
    setIsPlanting,
    dataStorage,
    setDataStorage,
    mines,
    setMines,
    cooldowns,
    setCooldowns,
    isFadingBetweenRoom,
    setIsFadingBetweenRoom,
    isUsingSecurityCamera,
    setIsUsingSecurityCamera,
    isCarryingObject,
    setIsCarryingObject,
    isUsingTurret,
    setIsUsingTurret,
    turretData,
    setTurretData,
    isPlayerInBossArea,
    setIsPlayerInBossArea,
    bossParameter,
    setBossParameter,
    energy,
    setEnergy,
    isDeath,
    setIsDeath,
    controlMap,
    isEnemyHit,
    setIsEnemyHit,
    enemyHitName,
    setEnemyHitName,
    showStar,
    setShowStar,
    isPaused,
    setIsPaused,
    isShowLevelResult,
    setIsShowLevelResult,
    searchDataNotify,
    searchAimDirection,
    searchResult,
    setSearchResult,
    isOpenInventory,
    setIsOpenInventory,
    inventoryItem,
    setInventoryItem,
    inventoryType,
    inventoryData,
    setInventoryData,
    playTimeInLevel,
    setPlayTimeInLevel,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
