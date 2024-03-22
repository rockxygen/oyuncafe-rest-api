// const httpStatus = require("http-status");

// const validate = (schema) = (req, res, next) => {
//     const { error, value } = schema.validate(req.body);

//     if(error){
//         const error_message = error.details?.map((detail) => detail.message).join(", ");

//         res.status(httpStatus.BAD_REQUEST).jsonp({
//             status: httpStatus.BAD_REQUEST,
//             message: error_message
//         });
//         return;
//     }
//     Object.assign(req, value);
//     return next();
// };

// module.exports = validate;

const httpStatus = require("http-status");

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details?.map((detail) => detail.message).join(", ");
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
    return;
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
