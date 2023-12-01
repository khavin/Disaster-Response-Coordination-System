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

app.get("/api/getResources", async (req, res) => {
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
  let reqId = null;

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

// Get available resources
app.get("/api/getAvailableResources/:city", (req, res) => {
  let locId = locationIdNameMapping[req.params["city"]];

  const query = `select rId, count(*) as Count From Volunteer Where locId = ${locId} and vId NOT IN (select vId From Tasks where startDate <= NOW() and endDate >= NOW()) group by rId`;

  connection.query(query, (err, result) => {
    if (err) throw err;
    else {
      let availResources = {};
      for (let entry of result) {
        let rName = resourceInfo[entry["rId"]][0];
        let rType = resourceInfo[entry["rId"]][1];
        if (!(resourceInfo[entry["rId"]][0] in availResources)) {
          availResources[rName] = {};
        }

        availResources[rName][rType] = entry["Count"];
      }
      res.json(availResources);
    }
  });
});

//request resources
app.post("/api/requestResources", async (req, res) => {
  let incId = req.body.incId;
  let locId = locationIdNameMapping[req.body.location];
  let status = "Pending";

  const reqQuery = `Insert into ResourceRequests(incId,locId,status)values("${incId}","${locId}","${status}");`;

  connection.query(reqQuery, (err, result) => {
    if (err) throw err;
    else {
      let reqId = result.insertId;
      let sql = "Insert INTO RequestInfo (`reqId`,`rId`,`quantity`) VALUES ? ";

      let values = [];
      for (let r in req.body.request) {
        for (let type in req.body.request[r]) {
          values.push([
            reqId,
            util.getResourceIdFromName(resourceInfo, r, type),
            req.body.request[r][type],
          ]);
        }
      }
      connection.query(sql, [values], function (err) {
        if (err) throw err;
        res.json({ reqId: reqId });
      });
    }
  });
});

// list of requested resources
app.get("/api/resourceRequests/:locName", async (req, res) => {
  let locId = locationIdNameMapping[req.params.locName];

  let query = `SELECT RequestInfo.reqId, rId, quantity,reqs.incId,reqs.title,reqs.description FROM DisasterResponseCoordination.RequestInfo
  JOIN
  (SELECT reqId,Incident.incId,Incident.title,Incident.description FROM DisasterResponseCoordination.ResourceRequests 
  JOIN Incident ON ResourceRequests.incId = Incident.incId
  WHERE ResourceRequests.locId=${locId} and ResourceRequests.status ="Pending") as reqs
  ON reqs.reqId = RequestInfo.reqId`;

  connection.query(query, (err, result) => {
    let response = {};
    for (let entry of result) {
      if (!(entry["reqId"] in response)) {
        response[entry["reqId"]] = {
          reqId: entry["reqId"],
          incId: entry["incId"],
          incTitle: entry["title"],
          incDesc: entry["description"],
          requestedResources: {},
        };
      }
      let rName = resourceInfo[entry["rId"]][0];
      let rType = resourceInfo[entry["rId"]][1];

      if (!(rName in response[entry["reqId"]]["requestedResources"])) {
        response[entry["reqId"]]["requestedResources"][rName] = {};
      }

      response[entry["reqId"]]["requestedResources"][rName][rType] =
        entry["quantity"];
    }

    res.json(response);
  });
});

//allocate resources
app.post("/api/allocateResources", async (req, res) => {
  let incId = req.body.incId;
  let locId = locationIdNameMapping[req.body.location];

  let sql = "Insert INTO Tasks (`vId`,`incId`,`startDate`,`endDate`) VALUES ? ";
  let query = "";

  for (let r in req.body.allocate) {
    for (let type in req.body.allocate[r]) {
      let rId = util.getResourceIdFromName(resourceInfo, r, type);

      query += `select vId From Volunteer Where locId = ${locId} and rId="${rId}" and vId NOT IN (select vId From Tasks where startDate <= NOW() and endDate >= NOW()) LIMIT ${req.body.allocate[r][type]};`;
    }
  }

  let values = [];

  let currentDate = new Date();
  let dateToday = currentDate.toISOString().slice(0, 10);

  let thirtyDaysFromNow = new Date(
    currentDate.setDate(currentDate.getDate() + 30)
  );
  thirtyDaysFromNow = thirtyDaysFromNow.toISOString().slice(0, 10);

  connection.query(query, (err, result) => {
    if (err) throw err;

    let len = 0;
    for (let r in req.body.allocate) {
      for (let type in req.body.allocate[r]) {
        len += 1;
      }
    }
    if (len < 2) {
      result = [result];
    }

    for (let r of result) {
      for (let entry of r) {
        values.push([entry["vId"], incId, dateToday, thirtyDaysFromNow]);
      }
    }
    connection.query(sql, [values], function (err) {
      if (err) throw err;
      res.json({ message: "Resources allocated." });
    });
  });
});

app.post("/api/updateRequestStatus", (req, res) => {
  let query = `UPDATE ResourceRequests SET status="${req.body.status}" WHERE reqId=${req.body.reqId}`;

  connection.query(query, (err, result) => {
    if (err) throw err;
    else {
      res.json({ message: "success" });
    }
  });
});

app.get("/api/getDashBoardInfo", (req, res) => {
  let token = req.cookies["authToken"];
  token = auth.decodeJWT(token);
  let locId = locationIdNameMapping[token["city"]];
  let response = {
    name: token["name"],
    role: token["role"],
    city: token["city"],
    state: "VA",
    availableResources: {},
    openResourceRequests: 0,
    currentIncAtLoc: [],
    allCurrentInc: [],
  };

  let query = `select rId, count(*) as Count From Volunteer Where locId = ${locId} and vId NOT IN (select vId From Tasks where startDate <= NOW() and endDate >= NOW()) group by rId;SELECT COUNT(*) as Count FROM ResourceRequests WHERE locId=${locId} AND status = "Pending";Select incId, title, description, city from Incident JOIN Location ON Incident.locId = Location.locId where Incident.locId = ${locId} and startDate <= NOW() and endDate >= NOW() ORDER BY incId DESC;Select incId, title, description, city from Incident JOIN Location ON Incident.locId = Location.locId where startDate <= NOW() and endDate >= NOW() ORDER BY incId DESC;`;

  connection.query(query, (err, result) => {
    if (err) throw err;
    else {
      for (let entry of result[0]) {
        let rName = resourceInfo[entry["rId"]][0];
        if (!(rName in response["availableResources"])) {
          response["availableResources"][rName] = 0;
        }

        response["availableResources"][rName] += entry["Count"];
      }

      response["openResourceRequests"] = result[1][0]["Count"];

      for (let entry of result[2]) {
        response["currentIncAtLoc"].push([
          entry["incId"],
          entry["city"],
          entry["title"],
          entry["description"],
        ]);
      }

      for (let entry of result[3]) {
        response["allCurrentInc"].push([
          entry["incId"],
          entry["city"],
          entry["title"],
          entry["description"],
        ]);
      }

      res.json(response);
    }
  });
});
