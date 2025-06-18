const { mission_employees } = require("../models/mission_employees.models");

class mission_EmployeesDao {
    async getAllAssignedEmployees(req, res, next) {
        try {
            const query = `SELECT * FROM mission_employees WHERE active = 'Y' ORDER BY employee_id ASC`;

            const employeesData = await mission_employees.sequelize.query(query, {
                type: mission_employees.sequelize.QueryTypes.SELECT,
            });

            if (employeesData && employeesData.length > 0) {
                res.status(200).json({
                    success: true,
                    data: employeesData,
                    message: "Employees retrieved successfully",
                });
            } else {
                res.status(200).json({
                    success: false,
                    data: [],
                    message: "No active employees found",
                });
            }
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = mission_EmployeesDao;
