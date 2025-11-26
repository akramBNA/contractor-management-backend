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

      const ongoingLeavesQuery = `
        SELECT 
            l.leave_id,
            l.employee_id,
            e.employee_name,
            e.employee_lastname,
            lt.leave_type_name,
            l.start_date,
            l.end_date
        FROM leaves l
        JOIN employees e ON e.employee_id = l.employee_id
        JOIN leave_types lt ON lt.leave_type_id = l.leave_type_id
        WHERE l.status = 'Approved'
          AND l.active = 'Y'
          AND e.active = 'Y'
          AND l.start_date <= CURRENT_DATE
          AND l.end_date >= CURRENT_DATE
        ORDER BY l.start_date ASC`;

      const ongoingLeaves = await employees.sequelize.query(
        ongoingLeavesQuery,
        { type: employees.sequelize.QueryTypes.SELECT }
      );

      res.status(200).json({
        success: true,
        data: {
          birthdaysData: birthdaysData,
          genderDistributionData: genderDistributionData[0],
          ongoingLeaves: ongoingLeaves,
        },
        message: "HR Stats retrieved successfully",
      });

    } catch (error) {
      return next(error);
    }
  };
}

module.exports = hr_statsDao;
