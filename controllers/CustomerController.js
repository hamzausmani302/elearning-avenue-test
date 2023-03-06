const dotenv = require("dotenv");

const DBO = require("../services/dbService");

dotenv.config();

const getCustomerFromEmail = async (req, res) => {
  const { username } = req.params;
  const customer = await DBO.getCustomer(username);
  if (customer == null) {
    return res.status(404).json({ message: "Not Found" });
  }
  const date = new Date(customer["birthdate"]);
  customer["birthdate"] = `${date.getFullYear()}-${`${
    date.getMonth() + 1 < 10 ? "0" : ""
  }${date.getMonth() + 1}`}-${date.getDate()}`;
  customer.accounts.map((account) => {
    const count = account.transaction_count[0].transaction_count;
    delete account.transaction_count;
    account["transaction_count"] = count;
  });
  res.status(200).json(customer);
};

module.exports.getCustomerFromEmail = getCustomerFromEmail;
