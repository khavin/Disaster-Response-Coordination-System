const { faker } = require("@faker-js/faker");
var mysql = require("mysql2");

// DB connection
var con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "admin123",
});

// Base insert statement
var insertStatement = "INSERT INTO {} VALUES ? ";

// Set DB to use
con.query("USE DisasterResponseCoordination;", function (err) {
  if (err) throw err;
});

// Resources info
let resourcesInfo = {
  "12-509-1079": {
    name: "Registered Nurse",
    types: 3,
    educationReq: {
      1: ["Bachelor of Science in Nursing"],
      2: ["Nursing - Specialty Preparation"],
      3: ["Graduate of an accredited nursing program"],
    },
    trainingReq: {
      1: [],
      2: [],
      3: [
        "Introduction to the Incident Command System, ICS-100",
        "S-200: Basic Incident Command System for Initial Response, ICS-200",
        "National Incident Management System, An Introduction, IS-700",
        "National Response Framework, An Introduction, IS-800",
        "Training in accordance with Occupational Safety and Health Administration (OSHA) 29 Code of Federal Regulations (CFR) Part 1910.120: Hazardous Materials Awareness",
        "Training in accordance with OSHA 29 CFR Part 1910.134: Respiratory Protection",
        "Training in accordance with OSHA 29 CFR Part 1910.1030: Bloodborne Pathogens",
      ],
    },
    experienceReq: {
      1: [
        {
          name: "Supervisory position within a healthcare setting",
          years: 3,
        },
      ],
      2: [
        {
          name: "Experience in the specialty practice area",
          years: 1,
        },
      ],
      3: [
        {
          name: "Experience in a clinical practice setting",
          years: 2,
        },
      ],
    },
    certificationReq: {
      1: [],
      2: [],
      3: [
        "State, District of Columbia or US territory-granted active status of legal authority to function as an RN without restrictions",
      ],
    },
  },
  "4-509-1481": {
    name: "Firefighter (Structural)",
    types: 2,
    educationReq: {
      1: [],
      2: [],
    },
    trainingReq: {
      1: [],
      2: [
        "Introduction to the Incident Command System, ICS-100",
        "S-200: Basic Incident Command System for Initial Response, ICS-200",
        "National Incident Management System, An Introduction, IS-700",
        "National Response Framework, An Introduction, IS-800",
        "Training in accordance with NFPA 472: Standard for Competence of Responders to Hazardous Materials/Weapons of Mass Destruction Incidents Operations Level, or equivalent basic instruction on responding to and operating in a chemical, biological, radiological, nuclear and explosive (CBRNE) incident",
        "Training in accordance with NFPA 1001: Standards for Fire Fighter Level I, or equivalent",
        "Additional Authority Having Jurisdiction (AHJ)-determined training",
      ],
    },
    experienceReq: {
      1: [],
      2: [
        {
          name: "Relevant, full-time firefighting experience, or equivalent, as the AHJ determines",
          years: 0,
        },
      ],
    },
    certificationReq: {
      1: [
        "AHJ certification equivalent to NFPA 1001: Standard for Fire Fighter Professional Qualifications, Firefighter Level II",
      ],
      2: [
        "AHJ certification equivalent to NFPA 472: Standard for Competence of Responders to Hazardous Materials/Weapons of Mass Destruction Incidents Operations Level or Occupational Safety and Health Administration (OSHA) 29 Code of Federal Regulations (CFR) Part 1910.120: Hazardous Waste Operations and Emergency Response",
        "AHJ certification equivalent to NFPA 1001: Standard for Fire Fighter Professional Qualifications, Firefighter Level I",
        "Any other AHJ-determined certification and recertification requirements",
      ],
    },
  },
  "3-509-1011": {
    name: "Ambulance Operator",
    types: 2,
    educationReq: {
      1: [
        "Completion of a state-approved Emergency Medical Technician (EMT) program, or completion of the minimum terminal learning objectives for EMT as defined by the NHTSA EMS Education Standards",
      ],
      2: [
        "High School Diploma",
        "A state-approved Emergency Medical Responder (EMR) program, or completion of the minimum terminal learning objectives for EMR as defined by the National Highway Traffic Safety Administration (NHTSA) National Emergency Medical Services (EMS) Education Standards",
      ],
    },
    trainingReq: {
      1: [],
      2: [
        "Introduction to the Incident Command System, ICS-100",
        "S-200: Basic Incident Command System for Initial Response, ICS-200",
        "National Incident Management System, An Introduction, IS-700",
        "National Response Framework, An Introduction, IS-800",
        "Training in accordance with Occupational Safety and Health Administration (OSHA) 29 Code of Federal Regulations (CFR) Part 1910.120: Hazardous Materials Awareness",
        "Training in accordance with OSHA 29 CFR Part 1910.134: Respiratory Protection",
        "Training in accordance with OSHA 29 CFR Part 1910.1030: Bloodborne Pathogens",
        "Authority Having Jurisdiction (AHJ) Emergency Vehicle Operators Course (EVOC)",
      ],
    },
    experienceReq: {
      1: [],
      2: [
        {
          name: "Emergency driving",
          years: 2,
        },
        { name: "Ambulance Operator", years: 1 },
      ],
    },
    certificationReq: {
      1: ["AHJ-certified EMT"],
      2: [
        "Valid state driver’s license, with appropriate endorsements where applicable",
        "AHJ-certified EMR",
        "AVOC, EVOC, or other recognized equivalent certification, as applicable",
      ],
    },
  },
  0: {
    name: "General",
    types: 1,
    educationReq: {
      1: [],
    },
    trainingReq: {
      1: [],
    },
    experienceReq: {
      1: [],
    },
    certificationReq: {
      1: [],
    },
  },
};

let educationSet = convertReqToSet("educationReq");
let trainingSet = convertReqToSet("trainingReq");
let certSet = convertReqToSet("certificationReq");
let experienceSet = convertReqToSet("experienceReq");

let educationIdNameMapping = createMapFromArray(educationSet);
let trainingIdNameMapping = createMapFromArray(trainingSet);
let certIdNameMapping = createMapFromArray(certSet);
let experienceIdNameMapping = createMapFromArray(experienceSet);

// Convert resource object to a set
function convertReqToSet(name) {
  // Iterate through the resource
  let dataSet = [];
  for (let r in resourcesInfo) {
    for (let e in resourcesInfo[r][name]) {
      dataSet = dataSet.concat(getArray(resourcesInfo[r][name][e], name));
    }
  }

  return [...new Set(dataSet)];
}

// Convert object array to string array
function getArray(data, name) {
  if (name == "experienceReq") {
    let convertedData = [];
    for (let e of data) {
      convertedData.push(e["name"]);
    }
    return convertedData;
  } else {
    return data;
  }
}

// Create a map of array elements
function createMapFromArray(data) {
  let map = {};

  let i = 0;
  for (let e of data) {
    map[e] = i;
    i++;
  }

  return map;
}

function insertData(sql, values, tableName) {
  con.query(sql, [values], function (err) {
    if (err) throw err;
    console.log(
      "Done - " + values.length + " values inserted in table: " + tableName
    );
  });
}

// Create resources
function createResources() {
  // Generated resources
  let gResources = [];

  for (let key in resourcesInfo) {
    // create a separate resource for each type
    for (let i = 0; i < resourcesInfo[key]["types"]; i++) {
      // resource object to be inserted into db
      let r = [key + "-" + i, resourcesInfo[key]["name"], i + 1];
      gResources.push(r);
    }
  }

  return gResources;
}

// Create location data
function createLocations() {
  cities_va = [
    { City: "Alexandria", "ZIP Code": "22301" },
    { City: "Blacksburg", "ZIP Code": "24060" },
    { City: "Richmond", "ZIP Code": "23220" },
    { City: "Arlington", "ZIP Code": "22201" },
    { City: "Norfolk", "ZIP Code": "23510" },
    { City: "Virginia Beach", "ZIP Code": "23456" },
    { City: "Chesapeake", "ZIP Code": "23320" },
    { City: "Newport News", "ZIP Code": "23601" },
    { City: "Hampton", "ZIP Code": "23666" },
    { City: "Roanoke", "ZIP Code": "24011" },
    { City: "Lynchburg", "ZIP Code": "24501" },
    { City: "Charlottesville", "ZIP Code": "22901" },
    { City: "Fredericksburg", "ZIP Code": "22401" },
    { City: "Suffolk", "ZIP Code": "23434" },
    { City: "Portsmouth", "ZIP Code": "23701" },
    { City: "Manassas", "ZIP Code": "20109" },
    { City: "Danville", "ZIP Code": "24541" },
    { City: "Harrisonburg", "ZIP Code": "22801" },
    { City: "Leesburg", "ZIP Code": "20175" },
    { City: "Petersburg", "ZIP Code": "23803" },
    { City: "Winchester", "ZIP Code": "22601" },
    { City: "Salem", "ZIP Code": "24153" },
    { City: "Staunton", "ZIP Code": "24401" },
    { City: "Fairfax", "ZIP Code": "22030" },
    { City: "Herndon", "ZIP Code": "20170" },
    { City: "Hopewell", "ZIP Code": "23860" },
    { City: "Christiansburg", "ZIP Code": "24073" },
    { City: "Waynesboro", "ZIP Code": "22980" },
    { City: "Culpeper", "ZIP Code": "22701" },
    { City: "Bristol", "ZIP Code": "24201" },
  ];

  let locations = [];
  for (let i = 0; i < cities_va.length; i++) {
    locations.push([
      i,
      faker.location.buildingNumber(),
      faker.location.street(),
      cities_va[i]["City"],
      cities_va[i]["ZIP Code"],
      "VA",
      null,
    ]);
  }

  return locations;
}

// Return admin values
function createTeamMembersAsVolunteers() {
  return [
    Object.values({
      vId: 0,
      name: "Vineela Yerrabelli",
      gender: "female",
      age: faker.number.int({ min: 18, max: 35 }),
      phoneNumber: faker.helpers.replaceSymbolWithNumber("(540)-###-####"),
      apartmentNumber: faker.location.buildingNumber(),
      street: faker.location.street(),
      city: "Richmond",
      state: "VA",
      zipcode: "23220",
      rId: "0-0",
      locId: 2,
      dLNo: "1234",
      passwordHash: "test",
      salt: "test",
      role: "admin",
    }),
    Object.values({
      vId: 1,
      name: "Khavin Krishnan Kalpana",
      gender: "male",
      age: faker.number.int({ min: 18, max: 35 }),
      phoneNumber: faker.helpers.replaceSymbolWithNumber("(540)-###-####"),
      apartmentNumber: faker.location.buildingNumber(),
      street: faker.location.street(),
      city: "Alexandria",
      state: "VA",
      zipcode: "22301",
      rId: "0-0",
      locId: 0,
      dLNo: "1234",
      passwordHash: "test",
      salt: "test",
      role: "admin",
    }),
    Object.values({
      vId: 2,
      name: "Nayaab Azim",
      gender: "female",
      age: faker.number.int({ min: 18, max: 35 }),
      phoneNumber: faker.helpers.replaceSymbolWithNumber("(540)-###-####"),
      apartmentNumber: faker.location.buildingNumber(),
      street: faker.location.street(),
      city: "Blacksburg",
      state: "VA",
      zipcode: "24060",
      rId: "0-0",
      locId: 1,
      dLNo: "1234",
      passwordHash: "test",
      salt: "test",
      role: "admin",
    }),
  ];
}

function updateMIDsInLocation() {
  for (let i = 0; i < locations.length; i++) {
    let q = "update Location set mId = " + i + " where locId = " + i + ";";
    con.query(q, function (err) {
      if (err) throw err;
    });
  }

  console.log("Updated Location table with mIds.");
}

// Create volunteer object
function createVolunteer(id) {
  let loc = faker.helpers.arrayElement(locations);

  return {
    vId: id,
    name: faker.person.fullName(),
    gender: faker.person.sex(),
    age: faker.number.int({ min: 18, max: 35 }),
    phoneNumber: faker.helpers.replaceSymbolWithNumber("(540)-###-####"),
    apartmentNumber: faker.location.buildingNumber(),
    street: faker.location.street(),
    city: loc[3],
    state: "VA",
    zipcode: loc[4],
    rId: faker.helpers.arrayElement(resources)[0],
    locId: loc[0],
    dLNo: "1234",
    passwordHash: "test",
    salt: "test",
    role: "volunteer",
  };
}

// Create entry object
function createEntryObject(reqMapping) {
  let data = [];
  for (let e in reqMapping) {
    data.push([reqMapping[e], e]);
  }

  return data;
}

// Create requirement objects
function createReqObject(reqMapping, name) {
  let data = [];

  // Iterate through resources
  for (let r in resourcesInfo) {
    // Go through different types of a resource
    for (let type in resourcesInfo[r][name]) {
      // For a type 1 resource, include requirements of the higher count resources
      for (let t = type; t <= resourcesInfo[r]["types"]; t++) {
        // Include requirements
        for (let entry of resourcesInfo[r][name][t]) {
          if (name == "experienceReq") {
            data.push([
              r + "-" + (type - 1),
              reqMapping[entry["name"]],
              entry["years"],
            ]);
          } else {
            data.push([r + "-" + (type - 1), reqMapping[entry]]);
          }
        }
      }
    }
  }

  return data;
}

// =========================== Start inserting data ================================

// Insert Resource information
let resourcesSql = insertStatement.replace("{}", "Resource");
let resources = createResources();
insertData(resourcesSql, resources, "Resource");

// Insert Education entries
let educationSql = insertStatement.replace("{}", "Education");
let educationDBData = createEntryObject(educationIdNameMapping);
insertData(educationSql, educationDBData, "Education");

// Insert Training entries
let trainingSql = insertStatement.replace("{}", "Training");
let trainingDBData = createEntryObject(trainingIdNameMapping);
insertData(trainingSql, trainingDBData, "Training");

// Insert Certification entries
let certSql = insertStatement.replace("{}", "Certification");
let certDBData = createEntryObject(certIdNameMapping);
insertData(certSql, certDBData, "Certification");

// Insert Profession entries
let professionSql = insertStatement.replace("{}", "Profession");
let professionDBData = createEntryObject(experienceIdNameMapping);
insertData(professionSql, professionDBData, "Profession");

// Insert Education requirements
let educationReqSql = insertStatement.replace("{}", "EducationRequirements");
let educationReqDBData = createReqObject(
  educationIdNameMapping,
  "educationReq"
);
insertData(educationReqSql, educationReqDBData, "EducationRequirements");

// Insert Training requirements
let trainingReqSql = insertStatement.replace("{}", "TrainingRequirements");
let trainingReqDBData = createReqObject(trainingIdNameMapping, "trainingReq");
insertData(trainingReqSql, trainingReqDBData, "TrainingRequirements");

// Insert Profession requirements
let professionReqSql = insertStatement.replace(
  "{}",
  "ProfessionalRequirements"
);
let professionReqDBData = createReqObject(
  experienceIdNameMapping,
  "experienceReq"
);
insertData(professionReqSql, professionReqDBData, "ProfessionalRequirements");

// Insert Certification requirements
let certReqSql = insertStatement.replace("{}", "CertRequirements");
let certReqDBData = createReqObject(certIdNameMapping, "certificationReq");
insertData(certReqSql, certReqDBData, "CertRequirements");

// Insert Location information
let locationsSql = insertStatement.replace("{}", "Location");
let locations = createLocations();
insertData(locationsSql, locations, "Location");

// Insert Volunteer information
let volunteerSql = insertStatement.replace("{}", "Volunteer");
// Volunteers to generate
let n = 100000;
// Get admin values
let volunteerValues = createTeamMembersAsVolunteers();
// Generate random values
for (let i = 3; i < n; i++) {
  let v = createVolunteer(i);
  volunteerValues.push(Object.values(v));
}
insertData(volunteerSql, volunteerValues, "Volunteer");

// Update manager ids in location table
updateMIDsInLocation();

con.end();
