import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResourceForm from "./resourceForm";

export default function AllocateResources() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataIsLoading, setDataIsLoading] = React.useState(false);
  const [formDataAvail, setFormDataAvail] = React.useState(false);

  const [rData, setRData] = React.useState(null);

  useEffect(() => {
    if (dataIsLoading == false && formDataAvail == false) {
      setDataIsLoading(true);

      fetch(
        "http://localhost:8067/api/getAvailableResources/" +
          location.state.city,
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
          setDataIsLoading(false);
          setRData(data);
          setFormDataAvail(true);
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
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
          id={location.state.incId}
          origCity={location.state.city}
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
