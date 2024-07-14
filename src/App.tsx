import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./scene/Home";
import SceneRouter, { Scene } from "./scene/SceneRouter";
import Test from "./scene/Test";
import Register from "./pages/Register";
import { GameProvider } from "./contexts/GameContext";
import DebugToolsBar from "./components/ui/DebugToolsBar";
import { useDebugTools } from "./hooks/useDebugsTool";
import CreateCharacter from "./pages/CreateCharacter";
import Welcome from "./scene/Welcome";
import Tutorial from "./scene/Tutorial";
import RequireAuth from "./components/RequireAuth";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineRoom from "./pages/OnlineRoom";
import GlobalGameUI from "./components/ui/GlobalGameUI";
import LevelSelection from "./scene/LevelSelection";
import Level1 from "./scene/GamePlay/Level1";
import Level2 from "./scene/GamePlay/Level2";
import Level3 from "./scene/GamePlay/Level3";
import { LevelProvider } from "./contexts/SceneContext/LevelContext";
import Level1DataLab from "./scene/GamePlay/Level1-DataLab";
import TestEnemy from "./scene/TestEnemy";
import { SettingProvider } from "./contexts/SettingContext";
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
                            <Scene title="tutorial" scene={<Tutorial />} />
                            <Scene title="test" scene={<Test />} />
                            <Scene title="test-enemy" scene={<TestEnemy />} />
                            <Scene title="level-selection" scene={<LevelSelection />} />
                            <Scene title="game-level-1" scene={<Level1DataLab/>} />
                            <Scene title="game-level-2" scene={<Level2 />} />
                            <Scene title="game-level-3" scene={<Level3 />} />
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
