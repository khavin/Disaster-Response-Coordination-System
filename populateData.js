const { faker } = require("@faker-js/faker");
var mysql = require("mysql2");

let v = createVolunteer();

// Volunteers to generate
let n = 100000;

let volunteerValues = [];
// Generate Data
for (let i = 0; i < n; i++) {
  let v = createVolunteer(i);
  volunteerValues.push(Object.values(v));
}

// Insert Query
var sql = "INSERT INTO Volunteer VALUES ? ";
var values = volunteerValues;

// DB connection
var con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "admin123",
});

con.query("USE DisasterResponseCoordination;", function (err) {
  if (err) throw err;
});

con.query(sql, [values], function (err) {
  if (err) throw err;
  console.log("Done - " + values.length + " values Inserted.");
  con.end();
});

// Create volunteer object
function createVolunteer(id) {
  return {
    vId: id,
    name: faker.person.fullName(),
    gender: faker.person.sex(),
    age: faker.number.int({ min: 18, max: 35 }),
    phoneNumber: faker.helpers.replaceSymbolWithNumber("(###)-##-#####"),
    apartmentNumber: faker.location.buildingNumber(),
    street: faker.location.street(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipcode: faker.location.zipCode(),
    rId: 1,
    locId: 1,
    dLNo: "1234",
    passwordHash: "test",
    salt: "test",
    role: "volunteer",
  };
}
