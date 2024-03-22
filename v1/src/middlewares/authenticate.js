const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || null;
  if (token === null) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      status_code: httpStatus.UNAUTHORIZED,
      status: false,
      error: {
        type: "unauthorized_account",
        message: "You must be login / Giriş yapmak zorundasınız."
      }
    });
  }
  JWT.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return res.status(httpStatus.FORBIDDEN).send({ error: err });
    req.user = user?._doc;
    next();
  });
};

module.exports = authenticateToken;