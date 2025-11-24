const { employees, sequelize: employeesSequelize } = require("../models/employees.models");

class hr_statsDao {

 async getAllEmployeesBirthdaysForThisMonth(req, res, next) {
    try {
      const currentMonth = new Date().getMonth() + 1;

      const get_birthdays_query = `SELECT e.employee_id,
                                        e.employee_name,
                                        e.employee_lastname,
                                        e.employee_birth_date
                                    FROM employees e
                                    WHERE EXTRACT(MONTH FROM e.employee_birth_date) = :currentMonth
                                    ORDER BY EXTRACT(DAY FROM e.employee_birth_date) ASC `;

      const birthdaysData = await employees.sequelize.query(get_birthdays_query, {
        replacements: { currentMonth },
        type: employees.sequelize.QueryTypes.SELECT,
      });
      
      if (birthdaysData) {
        res.status(200).json({
        success: true,
        data: birthdaysData,
        message: birthdaysData.length > 0 
                ? "Retrieved successfully" 
                : "No birthdays this month"
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }  
 };

};

module.exports = hr_statsDao;
