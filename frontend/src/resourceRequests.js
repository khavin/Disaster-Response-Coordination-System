import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResourceForm from "./resourceForm";
import DisplayResources from "./displayResources";

export default function ResourceRequests() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataAvail, setDataAvail] = React.useState(false);
  const [rData, setRData] = React.useState(null);

  const handleStatusChange = async (reqId, status) => {
    console.log(reqId);

    let cloneRData = Object.assign({}, rData);
    cloneRData[reqId]["status"] = "pending";
    setRData(cloneRData);

    await fetch("http://localhost:8067/api/updateRequestStatus", {
      method: "POST",
      body: JSON.stringify({
        reqId: reqId,
        status: status,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let cloneRData = Object.assign({}, rData);
        cloneRData[reqId]["status"] = status;
        setRData(cloneRData);
      })
      .catch((err) => {
        let cloneRData = Object.assign({}, rData);
        cloneRData[reqId]["status"] = status;
        setRData(cloneRData);
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (dataAvail == false) {
      fetch("http://localhost:8067/api/resourceRequests/", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setDataAvail(true);
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
          setDataAvail(true);
          setRData({
            2: {
              reqId: 2,
              incId: 5,
              incTitle: "Tittle",
              incDesc: "Description",
              requestedResources: {
                Nurse: {
                  1: 5,
                  2: 3,
                },
                AmbulanceDriver: {
                  2: 10,
                },
                FireFighter: {
                  1: 2,
                },
              },
              status: "",
            },
          });
        });
    }
  }, [isLoading, dataAvail]);

  if (isLoading) {
    return <div>Fetching data ...</div>;
  }

  if (dataAvail) {
    let requests = [];

    for (let entry in rData) {
      let actionButtonsRow = <div></div>;
      if (rData[entry]["status"] == "") {
        actionButtonsRow = (
          <div className="actionButtonsRow">
            <span
              className="allowDenyButtons"
              onClick={() => {
                handleStatusChange(rData[entry]["reqId"], "Approved");
              }}
            >
              Allow ✅
            </span>
            <span
              className="allowDenyButtons"
              onClick={() => {
                handleStatusChange(rData[entry]["reqId"], "Denied");
              }}
            >
              Deny ❌
            </span>
          </div>
        );
      } else {
        actionButtonsRow = (
          <div className="actionButtonsRow">
            <span className="dummyButton">{rData[entry]["status"]}</span>
            <span
              className="actionButton"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Back to Dashboard
            </span>
          </div>
        );
      }
      requests.push(
        <div key={rData[entry]["reqId"]}>
          <div>Request ID: {rData[entry]["reqId"]}</div>
          <div>Inc ID: {rData[entry]["incId"]}</div>
          <div>Inc Title: {rData[entry]["incTitle"]}</div>
          <div>Inc Description: {rData[entry]["incDesc"]}</div>
          <br></br>
          <div className="displayAllocRes">
            <DisplayResources
              id={rData[entry]["reqId"]}
              type={"requested"}
              title={
                "Requested resources for Inc #" +
                rData[entry]["incId"] +
                " " +
                rData[entry]["incTitle"]
              }
            ></DisplayResources>
          </div>
          {actionButtonsRow}
        </div>
      );
    }

    return <div>{requests}</div>;
  }
}
