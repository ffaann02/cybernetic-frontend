import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./scene/Home";
import SceneRouter, { Scene } from "./scene/SceneRouter";
import { useState } from "react";
import Test from "./scene/Test";
import Register from "./pages/Register";

function App() {
  const [currentScene, setCurrentScene] = useState<string>("home");

  return (
    <>
      <div className="w-full min-h-screen flex flex-col font-ibm">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div className="h-screen">
                  <SceneRouter currentScene={currentScene}>
                    <Scene title="home" scene={<Home/>} />
                    <Scene title="test" scene={<Test/>} />
                  </SceneRouter>
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
