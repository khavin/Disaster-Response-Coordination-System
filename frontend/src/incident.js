import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Incident() {
  const navigate = useNavigate();

  const [titleValue, settitleValue] = useState("");
  const [descValue, setdescValue] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleTitleChange = (event) => {
    settitleValue(event.target.value);
  };
  const handleDescChange = (event) => {
    setdescValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    await fetch("http://localhost:8067/api/createIncident", {
      method: "POST",
      body: JSON.stringify({
        title: titleValue,
        description: descValue,
        city: location.state.city,
        state: location.state.state,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/assignResources", {
          state: {
            incId: 5,
            city: location.state.city,
            state: location.state.state,
          },
        });
      });
  };

  return (
    <div className="loginForm">
      <div className="loginTitle">
        Report an Incident at {location.state.city}, {location.state.state}
      </div>
      <form>
        <label>Title</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={titleValue}
          onChange={handleTitleChange}
        />
        <br></br>
        <label>Description</label>
        <br></br>
        <textarea
          className="formInput"
          type="password"
          value={descValue}
          rows="5"
          onChange={handleDescChange}
        />
        <div className="registerButton" onClick={handleSubmit}>
          <LoadingButton loading={loading}>
            <span>Create Incident</span>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
