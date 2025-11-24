const { employees, sequelize: employeesSequelize } = require("../models/employees.models");
const { Op, Sequelize } = require("sequelize");

class hr_statsDao {
 async getAllEmployeesBirthdays(req, res, next) {
    try {
      const currentMonth = new Date().getMonth() + 1;

      const get_birthdays_query = `
        SELECT e.employee_id, e.employee_name, e.employee_lastname, e.employee_birth_date
        FROM employees e
        WHERE MONTH(e.employee_birth_date) = :currentMonth
        ORDER BY DAY(e.employee_birth_date) ASC
      `;

      const birthdaysData = await employeesSequelize.query(get_birthdays_query, {
        replacements: { currentMonth },
        type: Sequelize.QueryTypes.SELECT,
      });

      if (birthdaysData) {
        res.status(200).json({
          success: true,
          Data: birthdaysData,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          Data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }  
}

};

module.exports = hr_statsDao;
