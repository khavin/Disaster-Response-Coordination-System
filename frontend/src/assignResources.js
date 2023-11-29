import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DisplayResources from "./displayResources";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AssignResources() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataAvail, setDataAvail] = React.useState(false);
  const [incData, setIncData] = React.useState(null);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setDataAvail(true);
        // The following data should come from api
        setIncData({
          incId: 5,
          title: "Incident title",
          desc: "Incident description",
          assignedResources: {
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
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, dataAvail]);

  if (isLoading) {
    return <div>Fetching data ...</div>;
  }

  if (!dataAvail) {
    return <div>Unable to fetch data</div>;
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
