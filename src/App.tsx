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
import Level2Classify from "./game/level2-classify/scene/Level2-Classify";
import EnemyEnvironment from "./non-gameplay-scene/EnemyEnvironment";
import Level3SoundGEN from "./game/level3-sound-generative/scene/Level3-SoundGEN";
import Level5Final from "./game/level5-final/scene/Level5-Final";
import SlimeLab from "./game/slime-lab/scene/SlimeLab";
import { Level1ContextProvider } from "./contexts/SceneContext/Level1Context";
import { Level2ContextProvider } from "./contexts/SceneContext/Level2Context";
import { Level3ContextProvider } from "./contexts/SceneContext/Level3Context";
import OnlineGame1 from "./game/online-game1/scene/OnlineGame1";
import { TutorialContextProvider } from "./contexts/SceneContext/TutorialContext";
import { Level5ContextProvider } from "./contexts/SceneContext/Level5Context";
import Level6Reinforcement from "./game/level6-reinforcement/scene/Level6Reinforcement";
import { Level6ContextProvider } from "./contexts/SceneContext/Level6Context";
import LevelSelectionNew from "./non-gameplay-scene/LevelSelectionNew";
import { Level4ContextProvider } from "./contexts/SceneContext/Level4Context";
import Level4OCR from "./game/level4-ocr/scene/Level4OCR";
import { Suspense } from "react";
import { EnemyLabContextProvider } from "./contexts/SceneContext/EnemyLabContext";
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
              <Suspense fallback={null}>
                <Routes>
                  <Route element={<RequireAuth />}>
                    <Route
                      path="/"
                      element={
                        <div className="h-screen">
                          <LevelProvider>
                            <SceneRouter>
                              <Scene title="welcome" scene={<Welcome />} />
                              <Scene title="home" scene={<Home />} />
                              <Scene
                                title="enemy-environment"
                                scene={<EnemyEnvironment />}
                              />
                              <Scene
                                title="tutorial"
                                scene={
                                  <TutorialContextProvider>
                                    <Tutorial />
                                  </TutorialContextProvider>
                                }
                              />
                              <Scene
                                title="level-selection"
                                scene={<LevelSelectionNew />}
                              />
                              <Scene
                                title="game-level-1"
                                scene={
                                  <Level1ContextProvider>
                                    <Level1DataLab />
                                  </Level1ContextProvider>
                                }
                              />
                              <Scene
                                title="game-level-2"
                                scene={
                                  <Level2ContextProvider>
                                    <Level2Classify />
                                  </Level2ContextProvider>
                                }
                              />
                              <Scene
                                title="game-level-3"
                                scene={
                                  <Level3ContextProvider>
                                    <Level3SoundGEN />
                                  </Level3ContextProvider>
                                }
                              />
                              <Scene
                                title="game-level-4"
                                scene={
                                  <Level4ContextProvider>
                                    <Level4OCR />
                                  </Level4ContextProvider>
                                }
                              />
                              <Scene
                                title="game-level-5"
                                scene={
                                  <Level6ContextProvider>
                                    <Level6Reinforcement />
                                  </Level6ContextProvider>
                                }
                              />
                              <Scene
                                title="game-level-6"
                                scene={
                                  <Level5ContextProvider>
                                    <Level5Final />
                                  </Level5ContextProvider>
                                }
                              />
                              <Scene
                                title="slime-lab"
                                scene={
                                  <EnemyLabContextProvider>
                                    <SlimeLab />
                                  </EnemyLabContextProvider>
                                } />
                            </SceneRouter>
                          </LevelProvider>
                        </div>
                      }
                    />
                  </Route>
                  <Route
                    path="/online-game1/:roomId"
                    element={
                      <div className="h-screen">
                        <Scene title="welcome" scene={<OnlineGame1 />} />
                      </div>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/create-character"
                    element={<CreateCharacter />}
                  />
                  {/* Private Route */}
                  <Route element={<RequireAuth />}>
                    <Route path="/online-lobby" element={<OnlineLobby />} />
                    <Route
                      path="/online-room/:roomid"
                      element={<OnlineRoom />}
                    />
                  </Route>
                  <Route path="*" element={<div>404</div>} />
                </Routes>
              </Suspense>
            </Router>
          </div>
        </SettingProvider>
      </GameProvider>
    </>
  );
}

export default App;
