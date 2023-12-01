import mysql2 from "mysql2";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

const resourceInfo = util.getResourceInfo(connection);

const app = express();
app.use(express.json());
app.use(cookieParser());

// Set cors configuration
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

const PORT = 8067;
// Start the server
app.listen(PORT, () => {
  console.log(`SERVER : http://localhost:${PORT}`);
  connection.connect((err) => {
    if (err) throw err;
    console.log("DATABASE CONNECTION SUCCESFUL");
  });
});

// Request/Response interceptor
app.use((req, res, next) => {
  try {
    if (!(req.url == "/api/login" || req.url == "/api/signUp")) {
      // Verify the jwt token present in cookie
      if (
        Object.getPrototypeOf(req.cookies) == null ||
        req.cookies.length == 0 ||
        !("authToken" in req.cookies) ||
        !auth.verifyJWT(req.cookies["authToken"])
      ) {
        // Unauthorized access
        // Return 401
        let error = new Error("Unauthorized access");
        error.statusCode = 401;
        error.message = "Unauthorized access";
        throw error;
      }
    }
    // log the response
    res.on("finish", () => {
      console.log(`Request: ${req.url} Status: ${res.statusCode}`);
    });

    next();
  } catch (error) {
    // log the response
    console.log(`Request: ${req.url} Status: ${error.statusCode}`);
    next(error);
  }
});

const jsonErrorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode)
    .send({ statusCode: err["statusCode"], message: err["message"] });
};

app.use(jsonErrorHandler);

app.get("/getResources", async (req, res) => {
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
app.post("/api/login", async (req, res) => {
  let userSql =
    `Select * FROM Volunteer Where email like '` +
    req.body.email +
    "' Limit 1;";

  connection.query(userSql, (err, result) => {
    if (err) {
      throw err;
    } else {
      if (result.length > 0) {
        let userDetails = result[0];

        let passwordHash = auth.createHash(
          req.body.password,
          userDetails["salt"]
        );

        if (passwordHash === userDetails["passwordHash"]) {
          // Password verified

          let tokenData = {
            vId: userDetails["vId"],
            rId: userDetails["rId"],
            city: userDetails["city"],
            name: userDetails["name"],
            email: userDetails["email"],
            role: userDetails["role"],
            city: userDetails["city"],
          };

          res.cookie("authToken", auth.createJWT(tokenData), {
            maxAge: 1000 * 60 * 120,
            httpOnly: true,
          });
          res.send({ message: "Successfully authenticated" });
        } else {
          res.send({ message: "Invalid Username/Password" });
        }
      } else {
        res.send({ message: "Invalid Username/Password" });
      }
    }
  });
});

// Create a new volunteer
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
        city: city,
      };

      res.cookie("authToken", auth.createJWT(tokenData), {
        maxAge: 1000 * 60 * 120,
        httpOnly: true,
      });

      res.send({ message: "success" });
    }
  });
});

// Create a new Incident
app.post("/api/createIncident", async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let locId = locationIdNameMapping[req.body.city];

  const incidentQuery = `Insert into Incident (title, description, locId, startDate, endDate) values("${title}","${description}","${locId}",NOW(),DATE_ADD(NOW(), INTERVAL 30 DAY));`;

  connection.query(incidentQuery, (err, result) => {
    if (err) throw err;
    else {
      res.json({ success: true, incidentId: result.insertId });
    }
  });
});

// Get incident info
app.get("/api/getIncidentInfo/:incId", (req, res) => {
  let incId = req.params["incId"];

  const incidentQuery = `SELECT incId, title,description FROM Incident Where incId=${incId};SELECT rId, COUNT(*) as Count FROM Volunteer JOIN
  (SELECT vId FROM Tasks where incId = ${incId}
  and startDate <= NOW() and endDate >= NOW()) as assignedR
  ON Volunteer.vId = assignedR.vId GROUP BY rId;`;

  connection.query(incidentQuery, (err, result) => {
    if (err) throw err;
    else {
      let responseData = {
        incId: result[0][0]["incId"],
        title: result[0][0]["title"],
        desc: result[0][0]["description"],
        assignedResources: {},
      };

      let assignedResources = {};
      for (let entry of result[1]) {
        let rName = resourceInfo[entry["rId"]][0];
        let rType = resourceInfo[entry["rId"]][1];
        if (!(resourceInfo[entry["rId"]][0] in assignedResources)) {
          assignedResources[rName] = {};
        }

        assignedResources[rName][rType] = entry["Count"];
      }

      responseData["assignedResources"] = assignedResources;
      res.json(responseData);
    }
  });
});

//request resources
//available resources
