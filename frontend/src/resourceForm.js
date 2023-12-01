import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ResourceForm({ rData, location, type, id }) {
  let formDivs = [];
  let result = {};

  const navigate = useNavigate();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async () => {
    if (type == "Request") {
      await fetch("http://localhost:8067/api/requestResources", {
        method: "POST",
        body: JSON.stringify({
          request: result,
          location: location,
          incId: id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setSubmitted(true);
        })
        .catch((err) => {
          console.log(err.message);
          setSubmitted(true);
        });
    } else {
      await fetch("http://localhost:8067/api/allocateResources", {
        method: "POST",
        body: JSON.stringify({
          allocate: result,
          incId: id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setSubmitted(true);
        })
        .catch((err) => {
          console.log(err.message);
          setSubmitted(true);
        });
    }
  };

  for (let r in rData) {
    for (let type in rData[r]) {
      let element = (
        <div className="reqFormRow" key={r + "-" + type}>
          <span>{r}</span>&nbsp;<span>(Type {type})</span>&nbsp;
          <input
            className="reqFormInput"
            onChange={(e) => {
              if (!(r in result)) {
                result[r] = {};
              }

              result[r][type] = e.target.value;
            }}
          />
          &nbsp;/{rData[r][type]}
        </div>
      );
      formDivs.push(element);
    }
  }
  let content = (
    <div className="reqForm">
      {formDivs}
      <div className="reqFormSubmitButton">
        <span className="actionButton" onClick={handleSubmit}>
          {type}
        </span>
      </div>
    </div>
  );
  if (submitted) {
    let verb = "Resources Requested from " + location;
    if (type != "Request") {
      verb = "Resources allocated";
    }

    content = (
      <div className="reqForm">
        <div>{verb}</div>
        <br></br>
        <div>
          <span
            className="actionButton"
            onClick={(e) => {
              navigate("/dashboard");
            }}
          >
            Back to Dashboard
          </span>
        </div>
      </div>
    );
  }

  return <div className="reqFormContainer">{content}</div>;
}
