const billingsDao = require("../dao/billings.dao.js");

const billings_instance = new billingsDao();

module.exports = {
  getAllBillings: function (req, res, next) {
    billings_instance.getAllBillings(req, res, next);
  },
};
