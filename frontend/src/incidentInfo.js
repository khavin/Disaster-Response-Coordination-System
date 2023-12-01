import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DisplayResources from "./displayResources";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function IncidentInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataAvail, setDataAvail] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [incData, setIncData] = useState(null);

  useEffect(() => {
    if (dataLoading == false) {
      setDataLoading(true);

      fetch(
        "http://localhost:8067/api/getIncidentInfo/" + location.state.incId,
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
          setIncData(data);
          setDataAvail(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [dataLoading, dataAvail, incData]);

  if (!dataAvail) {
    return <div>Fetching data ...</div>;
  }

  return (
    <div>
      <div>Incident ID: {incData.incId}</div>
      <div>Incident Title: {incData.title}</div>
      <div>Incident Description: {incData.desc}</div>
      <br></br>
      <div className="displayAllocRes">
        <DisplayResources
          id={location.state.incId}
          type={"allocated"}
          title={
            "Allocated resources for Inc #" +
            location.state.incId +
            " " +
            incData.title
          }
        ></DisplayResources>
      </div>
      <br></br>
      <div className="actionButtonRow">
        <div
          className="actionButton"
          onClick={() => {
            navigate("/allocateResources", {
              state: {
                incId: incData.incId,
                city: location.state.city,
                state: location.state.state,
              },
            });
          }}
        >
          Allocate Resources
        </div>
        <div
          className="actionButton"
          onClick={() => {
            navigate("/requestResources", {
              state: {
                incId: incData.incId,
                city: location.state.city,
                state: location.state.state,
              },
            });
          }}
        >
          Request Resources
        </div>
      </div>
    </div>
  );
}
