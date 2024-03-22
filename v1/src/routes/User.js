const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { index, getAll, getUser, checkUsername, updateUser } = require("../controller/User");

router.get("/", index);
router.get("/getAll", authenticate, getAll);
router.get("/:username", authenticate, getUser);
router.post("/checkUsername", checkUsername);
router.post("/:username/update", authenticate, updateUser);

module.exports = router;