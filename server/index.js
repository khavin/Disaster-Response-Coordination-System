// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.listen(8867, () => console.log("listening to 8867.."));

import mysql2 from "mysql2";
import express from "express";

const connection = mysql2.createConnection({
  host: "localhost",
  database: "DisasterResponseCoordination",
  user: "root",
  password: "admin123",
  multipleStatements: true,
});
const app = express();
const PORT = 8067;
app.listen(PORT, () => {
  console.log(`SERVER : http://localhost:${PORT}`);
  connection.connect((err) => {
    if (err) throw err;
    console.log("DATABASE CONNECTION SUCCESFUL");
  });
});
// mysql2.createConnection({ multipleStatements: true });
app.use("/getResources", (req, res) => {
  var queries =
    "SELECT DISTINCT type FROM Resource;SELECT DISTINCT name FROM Certification;SELECT DISTINCT name FROM Education;SELECT DISTINCT name FROM Profession;SELECT DISTINCT name FROM Training;";

  connection.query(queries, (err, result) => {
    if (err) throw err;

    var txt = {
      Resource: [],
      Certification: [],
      Education: [],
      Profession: [],
      Training: [],
    };

    let i = 0;
    for (let key in txt) {
      for (let entry of result[i]) {
        if (i == 0) {
          txt[key].push(entry["type"]);
        } else {
          txt[key].push(entry["name"]);
        }
      }
      i += 1;
    }

    res.send(txt);

    for (let i in txt) {
      for (let x of result) {
        for (let y of x) {
          if ("type" in y) {
            txt[i].push(y["type"]);
          }
          if ("name" in y) {
            txt[i].push(y["name"]);
          }
        }
        break;
      }

      res.send(txt);
    }
  });
});
