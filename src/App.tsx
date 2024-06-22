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

function App() {
  const { currentScene } = useContext(GameContext);
  const showDebugTools = useDebugTools();

  return (
    <>
      <GameProvider>
        <div className="w-full min-h-screen flex flex-col font-ibm relative">
          {showDebugTools && <DebugToolsBar />}
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="h-screen">
                    <SceneRouter currentScene={currentScene}>
                      <Scene title="home" scene={<Home />} />
                      <Scene title="test" scene={<Test />} />
                    </SceneRouter>
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-character" element={<CreateCharacter/>} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </Router>
        </div>
      </GameProvider>
    </>
  );
}

export default App;
