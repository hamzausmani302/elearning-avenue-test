const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.DB_STRING);

class DBCLIENT {
  constructor() {
    this.run();
  }

  async run() {
    let conn;
    try {
      conn = await client.connect();
    } catch (e) {
      console.error(e);
    }
    this.db = conn.db(process.env.DB_NAME);
  }
  async getAccountSales(account_id) {
    const result = await this.db
      .collection("Transactions")
      .aggregate([
        { $match: { account_id: account_id } },
        {
          $unwind: { path: "$transactions", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$_id",
            sellsum: {
              $sum: {
                $cond: [
                  { $eq: ["$transactions.transaction_code", "sell"] },
                  "$transactions.amount",
                  0,
                ],
              },
            },

            buysum: {
              $sum: {
                $cond: [
                  { $eq: ["$transactions.transaction_code", "buy"] },
                  "$transactions.amount",
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .toArray();
    return result && result.length > 0 ? result[0] : null;
  }

  async getCustomer(username) {
    const result = await this.db
      .collection("Customers")
      .aggregate([
        { $match: { username: username } },
        {
          $lookup: {
            from: "Accounts",
            localField: "accounts",
            foreignField: "account_id",
            as: "accounts",
            pipeline: [
              {
                $project: {
                  account_id: 1,
                  limit: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: { path: "$accounts", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "Transactions",
            localField: "accounts.account_id",
            foreignField: "account_id",
            as: "accounts.transaction_count",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  transaction_count: 1,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            birthdate: { $first: "$birthdate" },
            email: { $first: "$email" },
            accounts: { $push: "$accounts" },
          },
        },
        {
          $project: { _id: 0 },
        },
      ])
      .toArray();
    console.log(result);
    return result && result.length > 0 ? result[0] : null;
  }
}

module.exports = new DBCLIENT();
// module.exports =
