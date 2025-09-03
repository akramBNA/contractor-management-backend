const { get } = require("express/lib/response");
const project_employeesDao = require("../dao/project_employees.dao");

const project_employees_instance = new project_employeesDao();

module.exports = {
    getProjectAssignedEmployees: function (req, res, next) {
        project_employees_instance.getProjectAssignedEmployees(req, res, next);
    }
};
