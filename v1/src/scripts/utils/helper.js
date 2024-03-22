const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

const hashPassword = (password) => {
    return CryptoJS.HmacSHA256(password, CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString();
}

const generateAccessToken = (user) => {
    console.log(user.username);
    return JWT.sign({ name: user.username, ...user }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1w" });
  };
  const generateRefreshToken = (user) => {
    return JWT.sign({ name: user.username, ...user }, process.env.REFRESH_TOKEN_KEY);
  };

module.exports = {
    hashPassword,
    generateAccessToken,
    generateRefreshToken
}