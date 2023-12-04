import "./App.css";
import Home from "./home.js";
import Login from "./login.js";
import SignUp from "./signUp.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import Incident from "./incident";
import IncidentInfo from "./incidentInfo";
import AllocateResources from "./allocateResources";
import RequestResources from "./requestResources";
import ResourceRequests from "./resourceRequests";
import LocationInfo from "./locationInfo";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header>
        <span
          className="site-title"
          onClick={(e) => {
            navigate("/dashboard");
          }}
        >
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
                <div className="customHeader">
                  <div className="dashboardTitle">Dashboard</div>
                  <LocationInfo />
                </div>
                <Dashboard />
              </div>
            }
          />
          <Route
            path="/createIncident"
            element={
              <div>
                <div className="customHeader">
                  <div className="dashboardTitle">Create Incident</div>
                  <LocationInfo />
                </div>
                <Incident />
              </div>
            }
          />
          <Route
            path="/incidentInfo"
            element={
              <div>
                <div className="customHeader">
                  <div className="dashboardTitle">
                    Allocate/Request Resources
                  </div>
                  <LocationInfo />
                </div>
                <IncidentInfo />
              </div>
            }
          />
          <Route
            path="/allocateResources"
            element={
              <div>
                <div className="customHeader">
                  <div className="dashboardTitle">Allocate Resources</div>
                  <LocationInfo />
                </div>
                <AllocateResources />
              </div>
            }
          />
          <Route
            path="/requestResources"
            element={
              <div>
                <div className="customHeader">
                  <div className="dashboardTitle">Request Resources</div>
                  <LocationInfo />
                </div>
                <RequestResources />
              </div>
            }
          />
          <Route
            path="/resourceRequests"
            element={
              <div>
                <div className="customHeader">
                  <div className="dashboardTitle">Resource Requests</div>
                  <LocationInfo />
                </div>

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
