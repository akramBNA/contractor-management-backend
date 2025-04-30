const employees = require("../models/employees.models");

class employeesDao {
  async getAllemployees(req, res, next) {
    try {
      const get_all_employees_query = "SELECT * FROM employees ORDER BY employee_id ASC";
      const get_all_employees_data = await employees.sequelize.query(
        get_all_employees_query,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_employees_data) {
        res.status(200).json({
          status: true,
          Data: get_all_employees_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          Data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = employeesDao;
