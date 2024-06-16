// import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// const history = createBrowserHistory();

function App() {
  return (
    <>
      <div className="w-full min-h-screen flex flex-col font-ibm">
        <Router>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login/>} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
