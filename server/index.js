import mysql2 from "mysql2";
import express from "express";

const connection = mysql2.createConnection({
  host: "localhost",
  database: "DisasterResponseCoordination",
  user: "root",
  password: "admin123",
  multipleStatements: true,
});
//Getting Location Ids
let loc = `Select locId, city from Location;`;
const locationIdNameMapping = {};
connection.query(loc, (err, result) => {
  if (err) {
    throw err;
  } else {
    // console.log(result);
    const lIds = result;
    console.log(lIds);

    for (let entry of lIds) {
      locationIdNameMapping[entry["city"]] = entry["locId"];
    }

    console.log(locationIdNameMapping);
  }
});

//Getting Education Ids
var educationIds = `Select Distinct * from Education;`;
const educationIdNameMapping = {};

connection.query(educationIds, (err, result) => {
  if (err) {
    throw err;
  } else {
    // console.log(result);
    const eIds = result;
    console.log(eIds);

    for (let entry of eIds) {
      educationIdNameMapping[entry["name"]] = entry["eId"];
    }

    console.log(educationIdNameMapping);
  }
});

//Getting profession Ids
var professionIds = `Select Distinct * from Profession`;
const professionIdNameMapping = {};

connection.query(professionIds, (err, result) => {
  if (err) {
    throw err;
  } else {
    // console.log(result);
    const pIds = result;
    // console.log(eIds);

    for (let entry of pIds) {
      professionIdNameMapping[entry["name"]] = entry["profId"];
    }

    console.log(professionIdNameMapping);
  }
});
//Getting training Ids
var trainingIds = `Select Distinct * from Training`;
const trainingIdNameMapping = {};

connection.query(trainingIds, (err, result) => {
  if (err) {
    throw err;
  } else {
    // console.log(result);
    const tIds = result;
    // console.log(eIds);

    for (let entry of tIds) {
      trainingIdNameMapping[entry["name"]] = entry["trainId"];
    }

    console.log(trainingIdNameMapping);
  }
});

//Getting certification Ids
var certificationIds = `Select Distinct * from Certification`;
const certificationIdNameMapping = {};

connection.query(certificationIds, (err, result) => {
  if (err) {
    throw err;
  } else {
    // console.log(result);
    const cIds = result;
    // console.log(eIds);

    for (let entry of cIds) {
      certificationIdNameMapping[entry["name"]] = entry["certId"];
    }

    console.log(certificationIdNameMapping);
  }
});

const app = express();
app.use(express.json());
const PORT = 8067;
app.listen(PORT, () => {
  console.log(`SERVER : http://localhost:${PORT}`);
  connection.connect((err) => {
    if (err) throw err;
    console.log("DATABASE CONNECTION SUCCESFUL");
  });
});

//app.use(express.bodyParser());

// mysql2.createConnection({ multipleStatements: true });
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

//Pushing Data to DB

var calculateResource = () => {
  // const name ="name";
  return "12-509-1079-1";
};

function calculateLocation(location) {
  if (location in locationIdNameMapping) {
    return locationIdNameMapping[location];
  }
}
app.post("/api/volunteerData", async (req, res) => {
  // console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const age = req.body.age;
  const phoneNumber = req.body.phoneNumber;
  const apartmentNumber = req.body.apartmentNumber;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;
  const dLNo = req.body.dLNo;
  const role = req.body.role;
  const passwordHash = req.body.passwordHash;
  const salt = "test";
  const education = req.body.education;
  const profession = req.body.profession;
  const training = req.body.tarining;
  const certification = req.body.certification;
  const rId = calculateResource();
  const locId = calculateLocation(req.body.location);
  let vId = null;
  // const eId = calculateEId();
  const vQuery = `Insert into Volunteer(name,email,gender,age,phoneNumber,apartmentNumber,street,city,state,zipcode,dLNo,role,passwordHash,salt,rId,locId) values("${name}","${email}","${gender}","${age}","${phoneNumber}","${apartmentNumber}","${street}","${city}","${state}","${zipcode}","${dLNo}","${role}","${passwordHash}","${salt}","${rId}","${locId}");`;
  connection.query(vQuery, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log("posted");
      res.json({ success: true, vid: result.insertId });
      vId = result.insertId;
      console.log({ vId });
      for (let entry of education) {
        if (entry in educationIdNameMapping) {
          let eId = educationIdNameMapping[entry];
          console.log(eId);
          const eQuery = `Insert into CompletedEducation(vId,eId) values("${vId}","${eId}");`;
          connection.query(eQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log("education posted");
            }
          });
        }
      }
      for (let entry of profession) {
        if (entry in professionIdNameMapping) {
          let profId = professionIdNameMapping[entry];
          console.log(profId);
          const pQuery = `Insert into ProfHistory(vId,eId) values("${vId}","${profId}");`;
          connection.query(pQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log("profession posted");
            }
          });
        }
      }
      for (let entry of training) {
        if (entry in trainingIdNameMapping) {
          let trainId = trainingIdNameMapping[entry];
          console.log(trainId);
          const tQuery = `Insert into CompletedTraining(vId,eId) values("${vId}","${trainId}");`;
          connection.query(tQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log("training posted");
            }
          });
        }
      }
      for (let entry of certification) {
        if (entry in certificationIdNameMapping) {
          let certId = certificationIdNameMapping[entry];
          console.log(certId);
          const cQuery = `Insert into CompletedEducation(vId,eId) values("${vId}","${certId}");`;
          connection.query(cQuery, (err, result) => {
            if (err) {
              throw err;
            } else {
              console.log("certification posted");
            }
          });
        }
      }
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
      console.log(incidentId);
    }
  });
});

//request resources
//available resources
