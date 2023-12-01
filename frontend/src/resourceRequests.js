import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResourceForm from "./resourceForm";
import DisplayResources from "./displayResources";

export default function ResourceRequests() {
  const navigate = useNavigate();
  const location = useLocation();

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
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        let cloneRData = Object.assign({}, rData);
        cloneRData[reqId]["status"] = status;
        setRData(cloneRData);
      })
      .catch((err) => {
        console.log(err.message);
      });

    if (status == "Approved") {
      await fetch("http://localhost:8067/api/allocateResources", {
        method: "POST",
        body: JSON.stringify({
          allocate: rData[reqId]["requestedResources"],
          incId: rData[reqId]["incId"],
          location: location.state.city,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    if (dataAvail == false) {
      fetch(
        "http://localhost:8067/api/resourceRequests/" + location.state.city,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setDataAvail(true);
          let modifiedData = data;
          for (let entry in modifiedData) {
            modifiedData[entry]["status"] = "";
          }
          setRData(modifiedData);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [isLoading, dataAvail, rData]);

  if (isLoading) {
    return <div>Fetching data ...</div>;
  }

  if (dataAvail) {
    if (Object.keys(rData).length == 0) {
      return (
        <div>
          <div>No resource requests</div>
          <br></br>
          <div>
            <span
              className="actionButton fitContent"
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
              additionalData={rData[entry]["requestedResources"]}
            ></DisplayResources>
          </div>
          {actionButtonsRow}
          <br></br>
          <br></br>
        </div>
      );
    }

    return <div>{requests}</div>;
  }
}
