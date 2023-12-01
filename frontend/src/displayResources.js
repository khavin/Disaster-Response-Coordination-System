import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DisplayResources({ id, type, title }) {
  const navigate = useNavigate();

  const [dataAvail, setDataAvail] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [rData, setRData] = useState(null);

  useEffect(() => {
    if (dataLoading == false) {
      setDataLoading(true);
      if (type == "allocated") {
        fetch("http://localhost:8067/api/getIncidentInfo/" + id, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            setRData(data["assignedResources"]);
            setDataAvail(true);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
      if (type == "available") {
      }
      if (type == "requested") {
      }
    }
  }, [dataLoading, dataAvail, rData]);

  if (!dataAvail) {
    return <div>Fetching data ...</div>;
  }

  let titleDiv = <div>{title}</div>;
  let rows = [];
  let rEmoji = {
    "Registered Nurse": "👩‍⚕️",
    "Ambulance Operator": "🧑‍🚒",
    "Firefighter (Structural)": "🚑",
  };

  for (let r in rData) {
    let types = [];
    for (let type in rData[r]) {
      let typeDiv = (
        <span className="rCountWidget" key={r + "-" + type}>
          Type-{type} <span className="rCountWidNumber">x{rData[r][type]}</span>
        </span>
      );
      types.push(typeDiv);
    }
    let rowTitle = (
      <span>
        {r}&nbsp;{rEmoji[r]}
      </span>
    );

    rows.push(
      <div key={r} className="displayResourceRow">
        {rowTitle}: &nbsp;
        {types}
      </div>
    );
  }

  if (rows.length == 0) {
    rows.push(<div key="none">None</div>);
  }

  return (
    <div className="displayResourceContainer">
      {titleDiv}
      <br></br>
      {rows}
    </div>
  );
}
