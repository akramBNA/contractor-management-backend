const contract_typesDao = require("../dao/contract_types.dao.js");

const contract_types_instance = new contract_typesDao();

module.exports = {
    getAllContractTypes: function (req, res, next) {
    contract_types_instance.getAllContractTypes(req, res, next);
  },

  addContractType: function (req, res, next) {
    contract_types_instance.addContractType(req, res, next);
  },
};
