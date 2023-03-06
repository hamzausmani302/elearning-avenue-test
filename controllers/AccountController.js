const dotenv = require("dotenv");

const DBO = require("../services/dbService");

dotenv.config();

const tryParse = (strNum) => {
  try {
    const num = parseInt(strNum);
    if (isNaN(num)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

const getAccountInfo = async (req, res) => {
  const { account } = req.params; //account -> account ID
  if (tryParse(account) === false) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const result = await DBO.getAccountSales(parseInt(account));
  if (result == null) {
    return res.status(404).json({ message: "Not Found" });
  }
  const { sellsum, buysum } = result;

  res
    .status(200)
    .json({ total_amount_sold: sellsum, total_amount_bought: buysum });
};

module.exports.getAccountInfo = getAccountInfo;
