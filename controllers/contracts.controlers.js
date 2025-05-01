const contractsDao = require("../dao/contracts.dao.js");

const contracts_instance = new contractsDao();

module.exports = {
    getAllContracts: function (req, res, next) {
    contracts_instance.getAllContracts(req, res, next);
  },
};
