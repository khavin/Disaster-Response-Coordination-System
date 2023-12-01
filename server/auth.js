import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";

let jwtSecretKey = "alksdfj%@aksdf@&w87rq389==sadfjklakjdf=";

export const createSalt = () => {
  return crypto.randomBytes(16).toString("base64");
};

export const createHash = (password, salt) => {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("base64");
};

export const createJWT = (data) => {
  return jsonwebtoken.sign(data, jwtSecretKey);
};

export const verifyJWT = (token) => {
  try {
    jsonwebtoken.verify(token, jwtSecretKey);
    // Token verified and decoded successfully
    return true;
  } catch (err) {
    return false;
  }
};
