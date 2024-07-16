import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";

const DebugToolsBar = () => {
  const {
    currentScene,
    speed,
    debug,
    sceneList,
    currentCamera,
    cameraList,
    setGameState,
  } = useContext(GameContext);

  const handleDebugChange = (e: any) => {
    if (setGameState) {
      setGameState((prevState) => ({ ...prevState, debug: e.value }));
    }
  };

  const handleSceneChange = (e: any) => {
    if (setGameState) {
      setGameState((prevState) => ({ ...prevState, currentScene: e.target.value }));
    }
  };

  const handleCameraChange = (e: any) => {
    if (setGameState) {
      setGameState((prevState) => ({ ...prevState, currentCamera: e.target.value }));
    }
  };

  const handleSpeedChange = (e: any) => {
    const newSpeed = parseFloat(e.value);
    if (setGameState) {
      setGameState((prevState) => ({ ...prevState, speed: newSpeed }));
    }
  };

  return (
    <div className="absolute right-6 top-6 bg-white/40 pt-4 pb-6 px-0 z-[10001] rounded-xl">
      <div>
        <div className="px-4">
          <div className="pb-2 border-b border-b-slate-400">
            <h2 className="text-xl font-semibold">Custom Debugging Tools</h2>
          </div>
        </div>
        <div className="mt-4 px-4 grid grid-cols-2 gap-y-4">
          <label className="my-auto">Collider</label>
          <InputSwitch
            checked={debug}
            onChange={handleDebugChange}
            className="ml-auto"
          />
          <label className="my-auto mr-10">Scene</label>
          <select
            value={currentScene}
            onChange={handleSceneChange}
            className="ml-auto p-2 rounded-lg w-full"
          >
            {sceneList.map((scene) => (
              <option key={scene} value={scene}>
                {scene}
              </option>
            ))}
          </select>
          <label className="my-auto mr-10">Camera</label>
          <select
            value={currentCamera}
            onChange={handleCameraChange}
            className="ml-auto w-full p-2 rounded-lg"
          >
            {cameraList.map((camera) => (
              <option key={camera} value={camera}>
                {camera}
              </option>
            ))}
          </select>
          <label className="my-auto">Speed</label>
          <InputNumber
            min={0}
            max={15}
            value={speed}
            onValueChange={handleSpeedChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DebugToolsBar;