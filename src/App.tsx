import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./game/home/scene/Home";
import SceneRouter, { Scene } from "./non-gameplay-scene/SceneRouter";
import Register from "./pages/Register";
import { GameProvider } from "./contexts/GameContext";
import DebugToolsBar from "./components/ui/DebugToolsBar";
import { useDebugTools } from "./hooks/useDebugsTool";
import CreateCharacter from "./pages/CreateCharacter";
import Welcome from "./non-gameplay-scene/Welcome";
import Tutorial from "./game/tutorial/scene/Tutorial";
import RequireAuth from "./components/RequireAuth";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineRoom from "./pages/OnlineRoom";
import GlobalGameUI from "./components/ui/GlobalGameUI";
import LevelSelection from "./non-gameplay-scene/LevelSelection";
import { LevelProvider } from "./contexts/SceneContext/LevelContext";
import Level1DataLab from "./game/level1-datalab/scene/Level1-DataLab";
import { SettingProvider } from "./contexts/SettingContext";
import Level2ImageLab from "./game/level2-classify/scene/Level2-ImageLab";
import EnemyEnvironment from "./non-gameplay-scene/EnemyEnvironment";
import Level3SoundGEN from "./game/level3-sound-generative/scene/Level3-SoundGEN";
function App() {
  const showDebugTools = useDebugTools();

  return (
    <>
      <GameProvider>
        <SettingProvider>
        <div className="w-full min-h-screen flex flex-col font-ibm relative overflow-hidden">
          {showDebugTools && <DebugToolsBar />}
            <Router>
              <GlobalGameUI />
              <Routes>
                <Route element={<RequireAuth />}>
                  <Route
                    path="/"
                    element={
                      <div className="h-screen">
                        <LevelProvider>
                          <SceneRouter >
                            <Scene title="welcome" scene={<Welcome />} />
                            <Scene title="home" scene={<Home />} />
                            <Scene title="enemy-environment" scene={<EnemyEnvironment />} />
                            <Scene title="tutorial" scene={<Tutorial />} />
                            <Scene title="level-selection" scene={<LevelSelection />} />
                            <Scene title="game-level-1" scene={<Level1DataLab/>} />
                            <Scene title="game-level-2" scene={<Level2ImageLab/>} />
                            <Scene title="game-level-3" scene={<Level3SoundGEN/>} />
                          </SceneRouter>
                        </LevelProvider>
                      </div>
                    }
                  />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-character" element={<CreateCharacter />} />
                {/* Private Route */}
                <Route element={<RequireAuth />}>
                  <Route path="/online-lobby" element={<OnlineLobby />} />
                  <Route path="/online-room/:roomid" element={<OnlineRoom />} />
                </Route>
                <Route path="*" element={<div>404</div>} />
              </Routes>
            </Router>
          </div>
        </SettingProvider>
      </GameProvider>
    </>
  );
}

export default App;
