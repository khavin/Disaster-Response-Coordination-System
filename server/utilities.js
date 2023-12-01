export const getResourceInfo = (connection) => {
  let rSql = "SELECT * FROM DisasterResponseCoordination.Resource;";

  let resourceInfo = {};
  connection.query(rSql, (err, result) => {
    if (err) {
      throw err;
    } else {
      for (let r of result) {
        resourceInfo[r["rId"]] = [r["type"], r["typeNumber"]];
      }
    }
  });
  return resourceInfo;
};

export const getLocationIdNameMapping = (connection) => {
  let loc = `Select locId, city from Location;`;
  let locationIdNameMapping = {};
  connection.query(loc, (err, result) => {
    if (err) {
      throw err;
    } else {
      const lIds = result;

      for (let entry of lIds) {
        locationIdNameMapping[entry["city"]] = entry["locId"];
      }
    }
  });

  return locationIdNameMapping;
};

export const getCertIdNameMapping = (connection) => {
  let certificationIds = `Select Distinct * from Certification`;
  let certificationIdNameMapping = {};

  connection.query(certificationIds, (err, result) => {
    if (err) {
      throw err;
    } else {
      const cIds = result;

      for (let entry of cIds) {
        certificationIdNameMapping[entry["name"]] = entry["certId"];
      }
    }
  });

  return certificationIdNameMapping;
};

export const getEduIdNameMapping = (connection) => {
  let educationIds = `Select Distinct * from Education;`;
  let educationIdNameMapping = {};

  connection.query(educationIds, (err, result) => {
    if (err) {
      throw err;
    } else {
      const eIds = result;

      for (let entry of eIds) {
        educationIdNameMapping[entry["name"]] = entry["eId"];
      }
    }
  });

  return educationIdNameMapping;
};

export const getProfIdNameMapping = (connection) => {
  let professionIds = `Select Distinct * from Profession`;
  let professionIdNameMapping = {};

  connection.query(professionIds, (err, result) => {
    if (err) {
      throw err;
    } else {
      const pIds = result;

      for (let entry of pIds) {
        professionIdNameMapping[entry["name"]] = entry["profId"];
      }
    }
  });

  return professionIdNameMapping;
};

export const getTrainIdNameMapping = (connection) => {
  let trainingIds = `Select Distinct * from Training`;
  let trainingIdNameMapping = {};

  connection.query(trainingIds, (err, result) => {
    if (err) {
      throw err;
    } else {
      const tIds = result;

      for (let entry of tIds) {
        trainingIdNameMapping[entry["name"]] = entry["trainId"];
      }
    }
  });

  return trainingIdNameMapping;
};

export const calculateLocation = (location, locationIdNameMapping) => {
  if (location in locationIdNameMapping) {
    return locationIdNameMapping[location];
  } else {
    return null;
  }
};

export const calcResourceRequirements = (connection) => {
  let reqSQL = `Select Distinct * from ProfessionalRequirements;Select Distinct * from CertRequirements;Select Distinct * from EducationRequirements;Select Distinct * from TrainingRequirements;`;

  let iReqNameMapping = {
    0: "pR",
    1: "cR",
    2: "eR",
    3: "tR",
  };

  let iTableIdMapping = {
    0: "profId",
    1: "certId",
    2: "eId",
    3: "trainId",
  };
  let requirements = {};

  connection.query(reqSQL, (err, result) => {
    if (err) {
      throw err;
    } else {
      let i = 0;
      for (let r of result) {
        for (let entry of r) {
          if (!(entry["rId"] in requirements)) {
            requirements[entry["rId"]] = {
              pR: [],
              cR: [],
              tR: [],
              eR: [],
            };
          }
          requirements[entry["rId"]][iReqNameMapping[i]].push(
            entry[iTableIdMapping[i]]
          );
        }
        i += 1;
      }
    }
  });

  return requirements;
};

export const convertNamesToIds = (nameArray, mapping) => {
  let idArray = [];
  for (let entry of nameArray) {
    idArray.push(mapping[entry]);
  }

  return idArray;
};

export const calcTypeOfResource = (
  requirements,
  profData,
  eData,
  certData,
  trainData
) => {
  let rId = "0-0";

  let catData = { pR: profData, cR: certData, tR: trainData, eR: eData };

  for (let rType in requirements) {
    let match = true;
    for (let cat in catData) {
      for (let entry of requirements[rType][cat]) {
        if (!catData[cat].includes(entry)) {
          match = false;
          break;
        }
      }
      if (!match) {
        break;
      }
    }

    if (match) return rType;
  }
  return rId;
};

export const getResourceIdFromName = (resourceInfo, name, type) => {
  for (let rId in resourceInfo) {
    if (resourceInfo[rId][0] === name && resourceInfo[rId][1] == type) {
      return rId;
    }
  }
};
