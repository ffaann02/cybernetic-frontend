import { RapierRigidBody } from "@react-three/rapier";
import React, { createContext, useContext, useRef, useState } from "react";

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
  };

  return (
    <Level1Context.Provider value={contextValue}>
      {children}
    </Level1Context.Provider>
  );
};