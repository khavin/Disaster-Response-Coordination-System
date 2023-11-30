import mysql2 from "mysql2";
import express from "express";
import cors from "cors";
import * as auth from "./auth.js";
import * as util from "./utilities.js";

const connection = mysql2.createConnection({
  host: "localhost",
  database: "DisasterResponseCoordination",
  user: "root",
  password: "admin123",
  multipleStatements: true,
});

//Getting Location Ids
const locationIdNameMapping = util.getLocationIdNameMapping(connection);

//Getting Education Ids
const educationIdNameMapping = util.getEduIdNameMapping(connection);

//Getting profession Ids
const professionIdNameMapping = util.getProfIdNameMapping(connection);

//Getting training Ids
const trainingIdNameMapping = util.getTrainIdNameMapping(connection);

//Getting certification Ids
const certificationIdNameMapping = util.getCertIdNameMapping(connection);

// Calculate the requirements
const requirements = util.calcResourceRequirements(connection);

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

const PORT = 8067;
app.listen(PORT, () => {
  console.log(`SERVER : http://localhost:${PORT}`);
  connection.connect((err) => {
    if (err) throw err;
    console.log("DATABASE CONNECTION SUCCESFUL");
  });
});

app.get("/getResources", (req, res) => {
  var queries =
    "SELECT DISTINCT type FROM Resource;SELECT DISTINCT city FROM Location;SELECT DISTINCT name FROM Certification;SELECT DISTINCT name FROM Education;SELECT DISTINCT name FROM Profession;SELECT DISTINCT name FROM Training;";

  connection.query(queries, (err, result) => {
    if (err) throw err;

    var txt = {
      Resource: [],
      City: [],
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
        } else if (i == 1) {
          txt[key].push(entry["city"]);
        } else {
          txt[key].push(entry["name"]);
        }
      }
      i += 1;
    }

    res.send(txt);
  });
});

app.post("/api/signUp", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const age = req.body.age;
  const phoneNumber = req.body.phone;
  const apartmentNumber = req.body.apt;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipCode;
  const dLNo = req.body.dl;
  const role = "volunteer";
  const education = req.body.eduValue;
  const profession = req.body.profValue;
  const training = req.body.trainValue;
  const certification = req.body.certValue;

  // Generate random salt
  const salt = auth.createSalt();
  const passwordHash = auth.createHash(req.body.password, salt);

  let pIds = util.convertNamesToIds(profession, professionIdNameMapping);
  let cIds = util.convertNamesToIds(certification, certificationIdNameMapping);
  let eIds = util.convertNamesToIds(education, educationIdNameMapping);
  let tIds = util.convertNamesToIds(training, trainingIdNameMapping);

  const rId = util.calcTypeOfResource(requirements, pIds, eIds, cIds, tIds);
  const locId = util.calculateLocation(req.body.city, locationIdNameMapping);

  let vId = null;

  const vQuery = `Insert into Volunteer(name,email,gender,age,phoneNumber,apartmentNumber,street,city,state,zipcode,dLNo,role,passwordHash,salt,rId,locId) values("${name}","${email}","${gender}","${age}","${phoneNumber}","${apartmentNumber}","${street}","${city}","${state}","${zipcode}","${dLNo}","${role}","${passwordHash}","${salt}","${rId}","${locId}");`;

  connection.query(vQuery, (err, result) => {
    if (err) {
      throw err;
    } else {
      vId = result.insertId;
      for (let entry of education) {
        if (entry in educationIdNameMapping) {
          let eId = educationIdNameMapping[entry];
          const eQuery = `Insert into CompletedEducation(vId,eId) values("${vId}","${eId}");`;
          connection.query(eQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
            }
          });
        }
      }
      for (let entry of profession) {
        if (entry in professionIdNameMapping) {
          let profId = professionIdNameMapping[entry];
          const pQuery = `Insert into ProfHistory(vId,profId) values("${vId}","${profId}");`;
          connection.query(pQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
            }
          });
        }
      }
      for (let entry of training) {
        if (entry in trainingIdNameMapping) {
          let trainId = trainingIdNameMapping[entry];
          const tQuery = `Insert into CompletedTraining(vId,trainId) values("${vId}","${trainId}");`;
          connection.query(tQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
            }
          });
        }
      }
      for (let entry of certification) {
        if (entry in certificationIdNameMapping) {
          let certId = certificationIdNameMapping[entry];
          const cQuery = `Insert into CompletedCert(vId,certId) values("${vId}","${certId}");`;
          connection.query(cQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
            }
          });
        }
      }

      let tokenData = {
        vId: vId,
        rId: rId,
        city: city,
        name: name,
        email: email,
        role: role,
        locId,
        locId,
      };

      res.cookie("authToken", auth.createJWT(tokenData), {
        maxAge: 1000 * 60 * 120,
        httpOnly: true,
      });

      res.send({ message: "success" });
    }
  });
});

//post incident to db
app.post("/api/incidentData", async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let locId = req.body.locId;
  let startDate = req.body.startDate;
  const incidentQuery = `Insert into Incident (title, description, locId) values("${title}","${description}","${locId}","${startDate}");`;
  connection.query(incidentQuery, (err, result) => {
    if (err) throw err;
    else {
      console.log("incident posted");
      res.json({ success: true, incidentId: result.insertId });
      let incidentId = result.insertId;
    }
  });
});

//request resources
//available resources
