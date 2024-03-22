const dotenv = require("dotenv");

const test = () => {
  console.log("Oyuncafe REST API v1");
}

module.exports = () => {
  dotenv.config();
  test();
};