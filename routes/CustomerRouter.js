const express = require("express");
const { getCustomerFromEmail } = require("../controllers/CustomerController");
const router = express.Router();

router.post("/:username", getCustomerFromEmail);

module.exports.CustomerRouter = router;
