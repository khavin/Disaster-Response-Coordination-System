import React, { useState } from "react";

export default function Login() {
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");

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
      });
  };

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
        <div className="registerButton" onClick={handleSubmit}>
          Login
        </div>
      </form>
    </div>
  );
}
