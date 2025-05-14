const employeesDao = require("../dao/employees.dao.js");

const employees_instance = new employeesDao();

module.exports = {
  getAllEmployees: function (req, res, next) {
    employees_instance.getAllEmployees(req, res, next);
  },
  getEmployeeById: function (req, res, next) {
    employees_instance.getEmployeeById(req, res, next);
  },
  addOneEmployee: function (req, res, next) {
    employees_instance.addOneEmployee(req, res, next);
  },
  getEmployeeById: function (req, res, next) {
    employees_instance.getEmployeeById(req, res, next);
  },
  getJobsAndContractTypes: function (req, res, next) {
    employees_instance.getJobsAndContractTypes(req, res, next);
  }
};
