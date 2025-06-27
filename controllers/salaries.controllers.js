const salariesDao = require("../dao/salaries.dao");

const salaries_instance = new salariesDao();

module.exports = {
  getAllSalaries: function (req, res, next) {
    salaries_instance.getAllSalaries(req, res, next);
  },
};
