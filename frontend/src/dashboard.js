import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./dataTable.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Dashboard() {
  // use navigate hook
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataAvail, setDataAvail] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [user, setUser] = React.useState(null);

  let columns1 = ["id", "name"];
  let data1 = [
    [1, "khavin"],
    [2, "Vin"],
    [3, "khavin"],
    [4, "Vin"],
    [5, "khavin"],
    [6, "Vin"],
    [7, "khavin"],
    [8, "Vin"],
    [9, "khavin"],
    [10, "Vin"],
    [11, "khavin"],
    [12, "Vin"],
    [13, "khavin"],
    [14, "Vin"],
    [15, "khavin"],
    [16, "Vin"],
    [17, "khavin"],
    [18, "Vin"],
    [19, "khavin"],
    [20, "Vin"],
  ];

  let columns2 = ["id", "full name"];
  let data2 = [
    [1, "lando"],
    [2, "max"],
    [3, "lando"],
    [4, "max"],
    [5, "lando"],
    [6, "max"],
    [7, "lando"],
    [8, "max"],
    [9, "lando"],
    [10, "max"],
    [11, "lando"],
    [12, "max"],
    [13, "lando"],
    [14, "max"],
    [15, "lando"],
    [16, "max"],
    [17, "lando"],
    [18, "max"],
    [19, "lando"],
    [20, "max"],
  ];

  const [columns, setColumns] = React.useState(columns1);
  const [data, setData] = React.useState(data1);

  const handleCreateInc = async () => {
    navigate("/createIncident", {
      state: { city: user.city, state: user.state },
    });
  };

  const handleTabChange = async (tab) => {
    setTab(tab);
    if (tab == 0) {
      setColumns(columns1);
      setData(data1);
    } else {
      setColumns(columns2);
      setData(data2);
    }
  };

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setDataAvail(true);
        // The following data should come from api
        setUser({
          name: "Peter Parker",
          role: "Admin",
          city: "Alexandria",
          state: "VA",
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

  let greetingsE = <div className="greetingsTitle">{user.name}</div>;
  let locationE = (
    <div>
      {user.city},&nbsp;{user.state}
    </div>
  );

  let incidentCreationButton = (
    <div className="incidentCreateContainer">
      <div className="createButton" onClick={handleCreateInc}>
        + Report an Incident
      </div>
    </div>
  );

  return (
    <div>
      <div className="greetingsPanel">
        <div className="greetings">
          {greetingsE}
          {locationE}
        </div>
        {incidentCreationButton}
      </div>
      <div>
        <div className="widgetRow">
          <span
            className="widget"
            onClick={() => {
              navigate("/resourceRequests");
            }}
          >
            <span>Open resource requests</span>
            <span className="widgetCount">8</span>
          </span>
          <span className="widget">
            <span>
              Available Nurses<br></br>
              <span className="resourceEmoji">👩‍⚕️</span>
            </span>
            <span className="widgetCount">10</span>
          </span>
          <span className="widget">
            <span>
              Available Firefighters<br></br>
              <span className="resourceEmoji">🧑‍🚒</span>
            </span>
            <span className="widgetCount">8</span>
          </span>
          <span className="widget">
            <span>
              Available drivers<br></br>
              <span className="resourceEmoji">🚑</span>
            </span>
            <span className="widgetCount">8</span>
          </span>
        </div>
        <span
          className={"incidentsSelectionTab " + (tab == 0 ? "selectedTab" : "")}
          onClick={() => handleTabChange(0)}
        >
          Ongoing Incidents at {user.city},&nbsp;{user.state}
        </span>
        &nbsp;
        <span
          className={"incidentsSelectionTab " + (tab == 1 ? "selectedTab" : "")}
          onClick={() => handleTabChange(1)}
        >
          All ongoing Incidents
        </span>
      </div>
      <br></br>
      <div>
        <DataTable columns={columns} tableData={data} tab={tab}></DataTable>
      </div>
    </div>
  );
}
