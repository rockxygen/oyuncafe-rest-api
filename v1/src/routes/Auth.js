const express = require("express");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const models = require("../validations/Auth");
const { index, login, register, forgotPassword, checkUsername, checkUserEmail, google, facebook, callback, fbcallback } = require("../controller/Auth");
const router = express.Router();

router.get("/", index);
router.post("/login", validate(models.loginValidation), login);
router.post("/register", validate(models.registerValidation), register);
router.post("/forgotPassword", forgotPassword);
router.get("/checkUsername/:username", checkUsername);
router.post("/checkUsername", checkUsername);
router.get("/checkUserEmail/:useremail", checkUserEmail);
router.post("/checkUserEmail", checkUserEmail);
router.get("/google", google);
router.get("/google/callback", callback);
router.get("/facebook", facebook);
router.get("/facebook/callback", fbcallback);

module.exports = router;