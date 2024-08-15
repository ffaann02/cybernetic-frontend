import { RapierRigidBody } from "@react-three/rapier";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { LaserTargetObjectProps } from "../../game/level1-datalab/scene-object/room2/LaserTargetObject";
import { LaserTargetObjectData } from "../../game/level1-datalab/scene-object/room2/LaserTargetObjectData";

// Define the shape of your context data
interface Level1ContextData {
  level: number;
  setLevel: (level: number) => void;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  isOpenChest: boolean;
  setIsOpenChest: (open: boolean) => void;
  isOpenDataCamera: boolean;
  setIsOpenDataCamera: (open: boolean) => void;
  craneUpNotAllow: React.RefObject<null>;
  securityCameraRef: React.RefObject<null>;
  laserRef: React.RefObject<RapierRigidBody>;
  imageCollectedList: any[];
  setImageCollectedList: (list: any[]) => void;
  textCollectedList: any[];
  setTextCollectedList: (list: any[]) => void;
  audioCollectedList: any[];
  setAudioCollectedList: (list: any[]) => void;
  objectCollectedList: any[];
  setObjectCollectedList: (list: any[]) => void;
  numericalCollectedList: any[];
  setNumericalCollectedList: (list: any[]) => void;
  maxImageCollected: number;
  setMaxImageCollected: (max: number) => void;
  maxAudioCollected: number;
  setMaxAudioCollected: (max: number) => void;
  maxTextCollected: number;
  setMaxTextCollected: (max: number) => void;
  maxObjectCollected: number;
  setMaxObjectCollected: (max: number) => void;
  maxNumericalCollected: number;
  setMaxNumericalCollected: (max: number) => void;
  isSourceFull: boolean;
  setIsSourceFull: (full: boolean) => void;
  isSubmitClicked: boolean;
  setIsSubmitClicked: (clicked: boolean) => void;
  collectedFullNotify: React.RefObject<null>;
  craneRedBox: React.RefObject<null>;
  confirmSelectedItems: any[];
  setConfirmSelectedItems: (items: any[]) => void;
  dataCollectNotify: React.RefObject<null>;
  allowRedPad: boolean;
  setAllowRedPad: (allow: boolean) => void;
  allowGreenPad: boolean;
  setAllowGreenPad: (allow: boolean) => void;
  objectData: LaserTargetObjectProps[];
  setObjectData: (data: LaserTargetObjectProps[]) => void;
  dropedObject: LaserTargetObjectProps[];
  setDropedObject: (data: LaserTargetObjectProps[]) => void;
  currentLaserTarget: string | null;
  setCurrentLaserTarget: (target: string | null) => void;
  rock1Ref: React.RefObject<null>;
  rock2Ref: React.RefObject<null>;
  rock3Ref: React.RefObject<null>;
  currentRock: number;
  setCurrentRock: (rock: number) => void;
  greenBoxRef: React.RefObject<null>;
  redBoxRef: React.RefObject<null>;
  level1PlayTime: number;
  setLevel1PlayTime: (time: number) => void;
  lastUpdateTimeRef: any;
}

// Create the Level1Context
const Level1Context = createContext<Level1ContextData | undefined>(undefined);

// Create a custom hook to access the Level1Context
export const useLevel1Context = () => {
  const context = useContext(Level1Context);
  if (!context) {
    throw new Error(
      "useLevel1Context must be used within a Level1ContextProvider"
    );
  }
  return context;
};

// Create the Level1ContextProvider component
export const Level1ContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [showDialog, setShowDialog] = useState(false);
  const [isOpenChest, setIsOpenChest] = useState(false);
  const [isOpenDataCamera, setIsOpenDataCamera] = useState(false);
  const craneUpNotAllow = useRef(null);

  const securityCameraRef = useRef(null);
  const laserRef = useRef<RapierRigidBody>(null);

  const [imageCollectedList, setImageCollectedList] = useState([]);
  const [textCollectedList, setTextCollectedList] = useState([]);
  const [audioCollectedList, setAudioCollectedList] = useState([]);
  const [objectCollectedList, setObjectCollectedList] = useState([]);
  const [numericalCollectedList, setNumericalCollectedList] = useState([]);

  const [maxImageCollected, setMaxImageCollected] = useState(5);
  const [maxAudioCollected, setMaxAudioCollected] = useState(5);
  const [maxTextCollected, setMaxTextCollected] = useState(3);
  const [maxObjectCollected, setMaxObjectCollected] = useState(4);
  const [maxNumericalCollected, setMaxNumericalCollected] = useState(2);
  const [isSourceFull, setIsSourceFull] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const collectedFullNotify = useRef(null);
  const craneRedBox = useRef(null);

  const [confirmSelectedItems, setConfirmSelectedItems] = useState([]);
  const dataCollectNotify = useRef(null);
  const [allowRedPad, setAllowRedPad] = useState(false);
  const [allowGreenPad, setAllowGreenPad] = useState(false);

  const [objectData, setObjectData] = useState<LaserTargetObjectProps[]>(LaserTargetObjectData);
  const [dropedObject, setDropedObject] = useState<LaserTargetObjectProps[]>([]);
  const [currentLaserTarget, setCurrentLaserTarget] = useState<string | null>(null);

  const rock1Ref = useRef();
  const rock2Ref = useRef();
  const rock3Ref = useRef();

  const [currentRock, setCurrentRock] = useState(0);

  const greenBoxRef = useRef();
  const redBoxRef = useRef();

  const [level1PlayTime, setLevel1PlayTime] = useState<number>(0);
  const lastUpdateTimeRef = useRef(Date.now());

  const contextValue: Level1ContextData = {
    level,
    setLevel,
    showDialog,
    setShowDialog,
    isOpenChest,
    setIsOpenChest,
    isOpenDataCamera,
    setIsOpenDataCamera,
    craneUpNotAllow,
    securityCameraRef,
    laserRef,
    imageCollectedList,
    setImageCollectedList,
    textCollectedList,
    setTextCollectedList,
    audioCollectedList,
    setAudioCollectedList,
    objectCollectedList,
    setObjectCollectedList,
    numericalCollectedList,
    setNumericalCollectedList,
    maxImageCollected,
    setMaxImageCollected,
    maxAudioCollected,
    setMaxAudioCollected,
    maxTextCollected,
    setMaxTextCollected,
    maxObjectCollected,
    setMaxObjectCollected,
    maxNumericalCollected,
    setMaxNumericalCollected,
    isSourceFull,
    setIsSourceFull,
    isSubmitClicked,
    setIsSubmitClicked,
    collectedFullNotify,
    craneRedBox,
    confirmSelectedItems,
    setConfirmSelectedItems,
    dataCollectNotify,
    allowRedPad,
    setAllowRedPad,
    allowGreenPad,
    setAllowGreenPad,
    objectData,
    setObjectData,
    dropedObject,
    setDropedObject,
    currentLaserTarget,
    setCurrentLaserTarget,
    rock1Ref,
    rock2Ref,
    rock3Ref,
    currentRock,
    setCurrentRock,
    greenBoxRef,
    redBoxRef,
    level1PlayTime,
    setLevel1PlayTime,
    lastUpdateTimeRef,
  };

  return (
    <Level1Context.Provider value={contextValue}>
      {children}
    </Level1Context.Provider>
  );
};
