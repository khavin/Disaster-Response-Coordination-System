var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "admin123",
});

let setupQueries = {
  "Start Transaction": "START TRANSACTION;",
  "Drop DB if exists": "DROP DATABASE IF EXISTS DisasterResponseCoordination;",
  "Create DB": "CREATE DATABASE DisasterResponseCoordination;",
  "Select DB": "USE DisasterResponseCoordination;",
  "Create Volunteer Table": `CREATE TABLE \`Volunteer\` (
        \`vId\` integer PRIMARY KEY auto_increment,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`gender\` varchar(255),
        \`age\` integer NOT NULL,
        \`phoneNumber\` varchar(255) NOT NULL,
        \`apartmentNumber\` varchar(255),
        \`street\` varchar(255),
        \`city\` varchar(255),
        \`state\` varchar(255),
        \`zipcode\` varchar(255) NOT NULL,
        \`rId\` varchar(20) NOT NULL,
        \`locId\` integer NOT NULL,
        \`dLNo\` varchar(255),
        \`passwordHash\` varchar(255) NOT NULL,
        \`salt\` varchar(255) NOT NULL,
        \`role\` varchar(255) NOT NULL
      );`,
  "Create Location Table": `CREATE TABLE \`Location\` (
        \`locId\` integer PRIMARY KEY,
        \`officeNumber\` varchar(255) NOT NULL,
        \`street\` varchar(255) NOT NULL,
        \`city\` varchar(255) NOT NULL,
        \`state\` varchar(255) NOT NULL,
        \`zipcode\` varchar(255) NOT NULL,
        \`mId\` integer
      );`,
  "Create Incident Table": `CREATE TABLE \`Incident\` (
        \`incId\` integer PRIMARY KEY auto_increment,
        \`locId\` integer NOT NULL,
        \`startDate\` varchar(255),
        \`endDate\` varchar(255)
      );`,
  "Create Tasks Table": `CREATE TABLE \`Tasks\` (
        \`vId\` integer,
        \`incId\` integer,
        \`startDate\` integer NOT NULL,
        \`endDate\` integer NOT NULL,
        PRIMARY KEY (\`vId\`, \`incId\`)
      );`,
  "Create ResourceRequests Table": `CREATE TABLE \`ResourceRequests\` (
        \`reqId\` integer PRIMARY KEY auto_increment,
        \`incId\` integer NOT NULL,
        \`locId\` integer NOT NULL,
        \`message\` varchar(255),
        \`status\` varchar(255)
      );`,
  "Create RequestInfo Table": `CREATE TABLE \`RequestInfo\` (
        \`reqId\` integer,
        \`rId\` varchar(20),
        \`quantity\` integer NOT NULL,
        PRIMARY KEY (\`reqId\`, \`rId\`)
      );`,
  "Create Resource Table": `CREATE TABLE \`Resource\` (
        \`rId\` varchar(20) PRIMARY KEY,
        \`type\` varchar(255) NOT NULL,
        \`typeNumber\` integer NOT NULL
      );`,
  "Create EducationReq Table": `CREATE TABLE \`EducationRequirements\` (
        \`rId\` varchar(20),
        \`eId\` integer,
        PRIMARY KEY (\`rId\`, \`eId\`)
      );`,
  "Create ProfesionalReq Table": `CREATE TABLE \`ProfessionalRequirements\` (
        \`rId\` varchar(20),
        \`profId\` integer,
        \`reqExp\` integer,
        PRIMARY KEY (\`rId\`, \`profId\`)
      );`,
  "Create Education Table": `CREATE TABLE \`Education\` (
        \`eId\` integer PRIMARY KEY,
        \`name\` TEXT NOT NULL
      );`,
  "Create Prof Table": `CREATE TABLE \`Profession\` (
        \`profId\` integer PRIMARY KEY,
        \`name\` TEXT NOT NULL
      );`,
  "Create Certification Table": `CREATE TABLE \`Certification\` (
        \`certId\` integer PRIMARY KEY,
        \`name\` TEXT NOT NULL
      );`,
  "Create CertReq Table": `CREATE TABLE \`CertRequirements\` (
        \`rId\` varchar(20),
        \`certId\` integer,
        PRIMARY KEY (\`rId\`, \`certId\`)
      );`,
  "Create Training Table": `CREATE TABLE \`Training\` (
        \`trainId\` integer PRIMARY KEY,
        \`name\` TEXT NOT NULL
      );`,
  "Create TrainingReq Table": `CREATE TABLE \`TrainingRequirements\` (
        \`rId\` varchar(20),
        \`trainId\` integer,
        PRIMARY KEY (\`rId\`, \`trainId\`)
      );`,
  "Create CompletedTraining Table": `CREATE TABLE \`CompletedTraining\` (
        \`vId\` integer,
        \`trainId\` integer,
        PRIMARY KEY (\`vId\`, \`trainId\`)
      );`,
  "Create CompletedEducation Table": `CREATE TABLE \`CompletedEducation\` (
        \`vId\` integer,
        \`eId\` integer,
        PRIMARY KEY (\`vId\`, \`eId\`)
      );`,
  "Create ProfHistory Table": `CREATE TABLE \`ProfHistory\` (
        \`vId\` integer,
        \`profId\` integer,
        PRIMARY KEY (\`vId\`, \`profId\`)
      );`,
  "Create CompletedCert Table": `CREATE TABLE \`CompletedCert\` (
        \`vId\` integer,
        \`certId\` integer,
        PRIMARY KEY (\`vId\`, \`certId\`)
      );`,
  "Foreign Keys": [
    "ALTER TABLE `Volunteer` ADD FOREIGN KEY (`locId`) REFERENCES `Location` (`locId`);",
    "ALTER TABLE `Volunteer` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `Location` ADD FOREIGN KEY (`mId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `ResourceRequests` ADD FOREIGN KEY (`incId`) REFERENCES `Incident` (`incId`);",
    "ALTER TABLE `ResourceRequests` ADD FOREIGN KEY (`locId`) REFERENCES `Location` (`locId`);",
    "ALTER TABLE `RequestInfo` ADD FOREIGN KEY (`reqId`) REFERENCES `ResourceRequests` (`reqId`);",
    "ALTER TABLE `RequestInfo` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `Incident` ADD FOREIGN KEY (`locId`) REFERENCES `Location` (`locId`);",
    "ALTER TABLE `Tasks` ADD FOREIGN KEY (`vId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `Tasks` ADD FOREIGN KEY (`incId`) REFERENCES `Incident` (`incId`);",
    "ALTER TABLE `EducationRequirements` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `EducationRequirements` ADD FOREIGN KEY (`eId`) REFERENCES `Education` (`eId`);",
    "ALTER TABLE `CertRequirements` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `CertRequirements` ADD FOREIGN KEY (`certId`) REFERENCES `Certification` (`certId`);",
    "ALTER TABLE `TrainingRequirements` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `TrainingRequirements` ADD FOREIGN KEY (`trainId`) REFERENCES `Training` (`trainId`);",
    "ALTER TABLE `ProfessionalRequirements` ADD FOREIGN KEY (`rId`) REFERENCES `Resource` (`rId`);",
    "ALTER TABLE `ProfessionalRequirements` ADD FOREIGN KEY (`profId`) REFERENCES `Profession` (`profId`);",
    "ALTER TABLE `CompletedTraining` ADD FOREIGN KEY (`vId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `CompletedTraining` ADD FOREIGN KEY (`trainId`) REFERENCES `Training` (`trainId`);",
    "ALTER TABLE `ProfHistory` ADD FOREIGN KEY (`vId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `ProfHistory` ADD FOREIGN KEY (`profId`) REFERENCES `Profession` (`profId`);",
    "ALTER TABLE `CompletedCert` ADD FOREIGN KEY (`vId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `CompletedCert` ADD FOREIGN KEY (`certId`) REFERENCES `Certification` (`certId`);",
    "ALTER TABLE `CompletedEducation` ADD FOREIGN KEY (`vId`) REFERENCES `Volunteer` (`vId`);",
    "ALTER TABLE `CompletedEducation` ADD FOREIGN KEY (`eId`) REFERENCES `Education` (`eId`);",
  ],
  "Commit Transaction": "COMMIT;",
};

console.log("Connected to MySQL server.");

for (let q in setupQueries) {
  console.log("Executing -- " + q);
  if (q == "Foreign Keys") {
    // Execute Foreign Keys array
    console.log("Adding foreign keys ...");
    for (let fkQuery of setupQueries[q]) {
      con.query(fkQuery, function (err, result) {
        if (err) throw err;
      });
    }
    console.log("Done -- Added " + setupQueries[q].length + " foreign keys.");
  } else {
    con.query(setupQueries[q], function (err, result) {
      if (err) throw err;
      console.log("Done -- " + q);
    });
  }
}

con.end();
