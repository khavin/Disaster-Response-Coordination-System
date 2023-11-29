import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResourceForm from "./resourceForm";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RequestResources() {
  const navigate = useNavigate();
  const location = useLocation();

  const [locIsLoading, setLocIsLoading] = React.useState(false);
  const [dataIsLoading, setDataIsLoading] = React.useState(false);
  const [locDataAvail, setLocDataAvail] = React.useState(false);
  const [formDataAvail, setFormDataAvail] = React.useState(false);

  const [locations, setLocations] = React.useState([]);
  const [selectedLoc, setSelectedLocation] = React.useState(null);

  const [rData, setRData] = React.useState(null);

  useEffect(() => {
    if (locIsLoading == false && locDataAvail == false) {
      setLocIsLoading(true);

      fetch("http://localhost:8067/api/locations", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLocIsLoading(false);
          setLocations(data);
          setLocDataAvail(true);
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
          setLocIsLoading(false);
          setLocations([
            "Alexandria",
            "Blacksburg",
            "Richmond",
            "Arlington",
            "Norfolk",
            "Virginia Beach",
            "Chesapeake",
            "Newport News",
            "Hampton",
            "Roanoke",
            "Lynchburg",
            "Charlottesville",
            "Fredericksburg",
            "Suffolk",
            "Portsmouth",
            "Manassas",
            "Danville",
            "Harrisonburg",
            "Leesburg",
            "Petersburg",
            "Winchester",
            "Salem",
            "Staunton",
            "Fairfax",
            "Herndon",
            "Hopewell",
            "Christiansburg",
            "Waynesboro",
            "Culpeper",
            "Bristol",
          ]);
          setLocDataAvail(true);
        });
    }

    if (
      dataIsLoading != true &&
      selectedLoc != null &&
      formDataAvail == false
    ) {
      setDataIsLoading(true);

      fetch("http://localhost:8067/api/getResources/" + selectedLoc, {
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
  }, [
    locIsLoading,
    dataIsLoading,
    locDataAvail,
    formDataAvail,
    locations,
    selectedLoc,
    rData,
  ]);

  if (locIsLoading) {
    return <div>Fetching data ...</div>;
  }

  if (!locDataAvail) {
    return <div>Unable to fetch data</div>;
  }

  let options = [];
  for (let entry of locations) {
    options.push(
      <option key={entry} value={entry}>
        {entry}
      </option>
    );
  }

  let resourceForm = <div></div>;
  if (formDataAvail) {
    resourceForm = (
      <div>
        <ResourceForm rData={rData} location={selectedLoc} type={"Request"} />
      </div>
    );
  }

  return (
    <div>
      <div className="selectDropDown">
        Select the location to request from:&nbsp;
        <select
          onChange={(e) => {
            setSelectedLocation(e.target.value);
          }}
          disabled={selectedLoc !== null}
        >
          {options}
        </select>
      </div>
      <div className="resourceForm">{resourceForm}</div>
    </div>
  );
}
