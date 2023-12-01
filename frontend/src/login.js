import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };
  const handlePassChange = (event) => {
    setPassValue(event.target.value);
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:8067/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: emailValue,
        password: passValue,
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] == "Successfully authenticated") {
          navigate("/dashboard");
        } else {
          setDisplayError(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  let errorEle = <div></div>;
  if (displayError) {
    errorEle = <div className="errorDiv">Invalid username/password</div>;
  }

  return (
    <div className="loginForm">
      <div className="loginTitle">Login</div>
      <form>
        <label>Email</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={emailValue}
          onChange={handleEmailChange}
        />
        <br></br>
        <label>Password</label>
        <br></br>
        <input
          className="formInput"
          type="password"
          value={passValue}
          onChange={handlePassChange}
        />
        {errorEle}
        <div className="registerButton" onClick={handleSubmit}>
          Login
        </div>
      </form>
    </div>
  );
}
