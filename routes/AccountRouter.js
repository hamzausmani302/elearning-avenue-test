const express = require("express");
const { getAccountInfo } = require("../controllers/AccountController");
const router = express.Router();

router.post("/:account", getAccountInfo);

module.exports.AccountRouter = router;
