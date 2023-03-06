const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const { CustomerRouter } = require("./routes/CustomerRouter");
const { AccountRouter } = require("./routes/AccountRouter");
const App = express();
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
dotenv.config();

App.use("/customer", CustomerRouter);
App.use("/account", AccountRouter);
const PORT = process.env.PORT || 3000;
App.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
require("./services/dbService");
