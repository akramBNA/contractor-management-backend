const { get } = require("express/lib/response");
const mission_EmployeesDao = require("../dao/mission_employees.dao");

const mission_employees_instance = new mission_EmployeesDao();

module.exports = {
    getAllAssignedEmployees: function (req, res, next) {
        mission_employees_instance.getAllAssignedEmployees(req, res, next);
    }
};
