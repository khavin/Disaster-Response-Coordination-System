import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./dataTable.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Dashboard() {
  // use navigate hook
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [dataAvail, setDataAvail] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [dashboardData, setDashboardData] = React.useState(null);

  let tableColumns = ["Incident ID", "City", "Title", "Description"];

  const [columns, setColumns] = React.useState(tableColumns);
  const [tableData, setTableData] = React.useState(null);

  const handleCreateInc = async () => {
    navigate("/createIncident", {
      state: { city: dashboardData["city"], state: dashboardData["state"] },
    });
  };

  const handleTabChange = async (tab) => {
    setTab(tab);
    if (tab == 0) {
      setTableData(dashboardData["currentIncAtLoc"]);
    } else {
      setTableData(dashboardData["allCurrentInc"]);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      fetch("http://localhost:8067/api/getDashBoardInfo/", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setDashboardData(data);
          setTableData(data["currentIncAtLoc"]);
          setDataAvail(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [isLoading, dataAvail]);

  if (!dataAvail) {
    return <div>Fetching data ...</div>;
  }

  let greetingsE = (
    <div className="greetingsTitle">{dashboardData["name"]}</div>
  );
  let locationE = (
    <div>
      {dashboardData["city"]},&nbsp;{dashboardData["state"]}
    </div>
  );

  let incidentCreationButton = (
    <div className="incidentCreateContainer">
      <div className="createButton" onClick={handleCreateInc}>
        + Report an Incident
      </div>
    </div>
  );

  let resourceWidgets = [];

  let rNameEmojiMapping = {
    General: "🙋",
    Nurses: "👩‍⚕️",
    Drivers: "🚑",
    Firefighters: "🧑‍🚒",
  };
  let apiNameDisplayNameMapping = {
    General: "General",
    Drivers: "Ambulance Operator",
    Firefighters: "Firefighter (Structural)",
    Nurses: "Registered Nurse",
  };

  for (let rName in apiNameDisplayNameMapping) {
    resourceWidgets.push(
      <span key={rName} className="widget">
        <span>
          Available {rName}
          <br></br>
          <span className="resourceEmoji">{rNameEmojiMapping[rName]}</span>
        </span>
        <span className="widgetCount">
          {apiNameDisplayNameMapping[rName] in
          dashboardData["availableResources"]
            ? dashboardData["availableResources"][
                apiNameDisplayNameMapping[rName]
              ]
            : 0}
        </span>
      </span>
    );
  }

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
              navigate("/resourceRequests", {
                state: {
                  city: dashboardData["city"],
                },
              });
            }}
          >
            <span>Open resource requests</span>
            <span className="widgetCount">
              {dashboardData["openResourceRequests"]}
            </span>
          </span>
          {resourceWidgets}
        </div>
        <span
          className={"incidentsSelectionTab " + (tab == 0 ? "selectedTab" : "")}
          onClick={() => handleTabChange(0)}
        >
          Ongoing Incidents at {dashboardData["city"]},&nbsp;
          {dashboardData["state"]}
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
        <DataTable
          columns={columns}
          tableData={tableData}
          tab={tab}
        ></DataTable>
      </div>
    </div>
  );
}
