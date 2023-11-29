import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResourceForm from "./resourceForm";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AllocateResources() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataIsLoading, setDataIsLoading] = React.useState(false);
  const [formDataAvail, setFormDataAvail] = React.useState(false);

  const [rData, setRData] = React.useState(null);

  useEffect(() => {
    if (dataIsLoading == false && formDataAvail == false) {
      setDataIsLoading(true);

      fetch("http://localhost:8067/api/getResources/" + location.state.city, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDataIsLoading(false);
          setRData(data);
          setFormDataAvail(true);
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
          setDataIsLoading(false);
          setFormDataAvail(true);
          setRData({
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
          });
        });
    }
  }, [dataIsLoading, formDataAvail, rData]);

  let resourceForm = <div></div>;
  if (formDataAvail) {
    resourceForm = (
      <div>
        <ResourceForm
          rData={rData}
          location={location.state.city}
          type={"Allocate"}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="resourceForm">{resourceForm}</div>
    </div>
  );
}
