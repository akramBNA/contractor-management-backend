const employeesDao = require("../dao/employees.dao.js");

const employees_instance = new employeesDao();

module.exports = {
    getAllemployees: function (req, res, next) {
    employees_instance.getAllemployees(req, res, next);
  },
};
