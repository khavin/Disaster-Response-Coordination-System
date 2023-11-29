import "./App.css";
import Home from "./home.js";
import Login from "./login.js";
import SignUp from "./signUp.js";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import Incident from "./incident";
import AssignResources from "./assignResources";
import AllocateResources from "./allocateResources";
import RequestResources from "./requestResources";
import ResourceRequests from "./resourceRequests";

function App() {
  return (
    <div className="App">
      <header>
        <span className="site-title">
          Disaster Response Coordination System
        </span>
      </header>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <div>
                <div className="dashboardTitle">Login</div>
                <Login />
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div>
                <div className="dashboardTitle">Sign Up</div>
                <SignUp />
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <div>
                <div className="dashboardTitle">Dashboard</div>
                <Dashboard />
              </div>
            }
          />
          <Route
            path="/createIncident"
            element={
              <div>
                <div className="dashboardTitle">Create Incident</div>
                <Incident />
              </div>
            }
          />
          <Route
            path="/assignResources"
            element={
              <div>
                <div className="dashboardTitle">Allocate/Request Resources</div>
                <AssignResources />
              </div>
            }
          />
          <Route
            path="/allocateResources"
            element={
              <div>
                <div className="dashboardTitle">Allocate Resources</div>
                <AllocateResources />
              </div>
            }
          />
          <Route
            path="/requestResources"
            element={
              <div>
                <div className="dashboardTitle">Request Resources</div>
                <RequestResources />
              </div>
            }
          />
          <Route
            path="/resourceRequests"
            element={
              <div>
                <div className="dashboardTitle">Resource Requests</div>
                <ResourceRequests />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
