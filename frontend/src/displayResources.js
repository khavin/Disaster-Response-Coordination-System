import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DisplayResources({ id, type, title }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataAvail, setDataAvail] = React.useState(false);
  const [rData, setRData] = React.useState(null);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (type == "allocated") {
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
        }
        if (type == "available") {
          setRData({
            Nurse: {
              1: 5,
              2: 3,
              3: 10,
            },
            AmbulanceDriver: {
              1: 2,
              2: 10,
            },
            FireFighter: {
              1: 2,
              2: 23,
            },
          });
        }
        if (type == "requested") {
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
        }
        setIsLoading(false);
        setDataAvail(true);
        // The following data should come from api
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

  let titleDiv = <div>{title}</div>;
  let rows = [];
  let rEmoji = {
    Nurse: "👩‍⚕️",
    AmbulanceDriver: "🧑‍🚒",
    FireFighter: "🚑",
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

  return (
    <div className="displayResourceContainer">
      {titleDiv}
      {rows}
    </div>
  );
}
