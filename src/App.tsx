import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./scene/Home";
import SceneRouter, { Scene } from "./scene/SceneRouter";
import { useContext } from "react";
import Test from "./scene/Test";
import Register from "./pages/Register";
import { GameContext, GameProvider } from "./contexts/GameContext";
import DebugToolsBar from "./components/ui/DebugToolsBar";
import { useDebugTools } from "./hooks/useDebugsTool";
import CreateCharacter from "./pages/CreateCharacter";
import Welcome from "./scene/Welcome";
import Tutorial from "./scene/Tutorial";
import RequireAuth from "./components/RequireAuth";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineRoom from "./pages/OnlineRoom";
import GlobalGameUI from "./components/ui/GlobalGameUI";
function App() {
  const { currentScene } = useContext(GameContext);
  const showDebugTools = useDebugTools();

  return (
    <>
  <GameProvider>
    <div className="w-full min-h-screen flex flex-col font-ibm relative">
      {showDebugTools && <DebugToolsBar />}
      <Router>
        <GlobalGameUI/>
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-screen">
                <SceneRouter currentScene={currentScene}>
                  <Scene title="welcome" scene={<Welcome />} />
                  <Scene title="home" scene={<Home />} />
                  <Scene title="tutorial" scene={<Tutorial />} />
                  <Scene title="test" scene={<Test />} />
                </SceneRouter>
              </div>
            }
          />
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
  </GameProvider>
    </>
  );
}

export default App;
