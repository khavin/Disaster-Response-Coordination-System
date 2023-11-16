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
  // Add resources
  let resources = {
    "12-509-1079": {
      name: "Registered Nurse",
      types: 3,
    },
    "4-509-1481": {
      name: "Firefighter (Structural)",
      types: 2,
    },
    "3-509-1011": {
      name: "Ambulance Operator",
      types: 2,
    },
    0: {
      name: "General",
      types: 1,
    },
  };

  // Generated resources
  let gResources = [];

  for (let key in resources) {
    // create a separate resource for each type
    for (let i = 0; i < resources[key]["types"]; i++) {
      // resource object to be inserted into db
      let r = [key + "-" + i, resources[key]["name"], i + 1];
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

// =========================== Start inserting data ================================

// Insert Resource information
let resourcesSql = insertStatement.replace("{}", "Resource");
let resources = createResources();
insertData(resourcesSql, resources, "Resource");

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
