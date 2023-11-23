import "./App.css";
import Home from "./home.js";
import Login from "./login.js";
import SignUp from "./signUp.js";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header>
        <span className="site-title">
          Disaster Response Coordination System
        </span>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
