const {
  employees,
  sequelize: employeesSequelize,
} = require("../models/employees.models");

class hr_statsDao {
  async hrStatistics(req, res, next) {
    try {
      const currentMonth = new Date().getMonth() + 1;

      const getGenderDistributionQuery = `SELECT 
                                              SUM(CASE WHEN employee_gender = 'Male' THEN 1 ELSE 0 END) AS male_count,
                                              SUM(CASE WHEN employee_gender = 'Female' THEN 1 ELSE 0 END) AS female_count
                                          FROM employees
                                          WHERE active = 'Y'`;

      const genderDistributionData = await employees.sequelize.query(getGenderDistributionQuery,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );

      const get_birthdays_query = `SELECT e.employee_id,
                                        e.employee_name,
                                        e.employee_lastname,
                                        e.employee_birth_date
                                    FROM employees e
                                    WHERE EXTRACT(MONTH FROM e.employee_birth_date) = :currentMonth
                                    ORDER BY EXTRACT(DAY FROM e.employee_birth_date) ASC `;

      const birthdaysData = await employees.sequelize.query(get_birthdays_query,
        {
          replacements: { currentMonth },
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json({
        success: true,
        data: {
          birthdaysData: birthdaysData,
          genderDistributionData: genderDistributionData[0],
        },
        message: "HR Stats retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = hr_statsDao;
