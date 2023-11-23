import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Handle login button click
  const handleLoginClick = () => {
    navigate("login");
  };

  // Handle sign up button click
  const handleSignUpClick = () => {
    navigate("signup");
  };

  return (
    <div className="homeContainer">
      <div className="userRegisterButtons">
        <div className="registerButton" onClick={handleLoginClick}>
          Login
        </div>
        <div className="registerButton" onClick={handleSignUpClick}>
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default Home;
