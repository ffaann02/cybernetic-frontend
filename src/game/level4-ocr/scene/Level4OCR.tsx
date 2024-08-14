import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GameContext } from "../../../contexts/GameContext";
import CharacterController, {
  Controls,
} from "../../../controllers/CharacterController";
import { KeyboardControls, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { SceneObject } from "../scene-object/SceneObject";
import useAxios from "../../../hooks/useAxios";
import { useAuth } from "../../../hooks/useAuth";
import { useLevel4Context } from "../../../contexts/SceneContext/Level4Context";
import OcrPasswordUI from "../ui/OcrPasswordUI";
import CharacterStorageUI from "../ui/CharacterStorageUI";

type Props = {};

const Level4OCR: React.FC<Props> = () => {
  const { user } = useAuth();
  const { debug, currentCamera } = useContext(GameContext);
  const { axiosFetch } = useAxios();
  const { isOpenOcrPassword, isOpenCharacterStorage } = useLevel4Context();
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

  return (
    <>
      {isOpenOcrPassword && <OcrPasswordUI/>}
      {isOpenCharacterStorage && <CharacterStorageUI/>}
      <KeyboardControls map={controlMap}>
        <Canvas
          dpr={[1, 2]}
          style={{ height: "100%", width: "100%" }}
          shadows
          className="z-0"
        >
          {/* <fog attach="fog" args={["skyblue", 15, 30]} /> */}
          {/* <color attach="background" args={["black"]} /> */}
          {currentCamera === 2 && (
            <PerspectiveCamera makeDefault position={[0, 4, 10]} />
          )}
          {/* <PerspectiveCamera makeDefault position={[0, 2, 10]} /> */}
          <ambientLight intensity={0.5} color={"lightblue"} />

          <Suspense fallback={null}>
            <Physics debug={debug} gravity={[0, -9.81, 0]}>
              <CharacterController spawnPosition={[-28, 2, 35]} />
              <SceneObject />
            </Physics>
          </Suspense>
          {/* <OrbitControls /> */}
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Level4OCR;
