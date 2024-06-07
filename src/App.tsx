import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import Home from "./scene/Home";

function App() {
  return (
    <>
      <div className="w-full overflow-y-scroll max-h-screen bg-neutral-400 mx-auto p-6">
        <div className="bg-white mx-auto max-w-7xl">
          <div className="w-full bg-blue-100">
            {/* <Home
              gridSize={GRID_SIZE}
              playerPosition={DEFAULT_PLAYER_POSITION}
            /> */}
            <Home/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
