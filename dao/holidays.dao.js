const { DATE } = require("sequelize");
const { holidays } = require("../models/holidays.models");

class holidaysDao {
  async getAllHolidaysByYear(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const years = params.years || new Date().getFullYear();

      const get_all_holidays_query = `SELECT * FROM holidays WHERE active='Y' AND EXTRACT(YEAR FROM holiday_date) = :years ORDER BY holiday_date ASC`;
      const get_all_holidays_data = await holidays.sequelize.query(
        get_all_holidays_query,
        {
          replacements: { years },
          type: holidays.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_holidays_data) {
        res.status(200).json({
          success: true,
          data: get_all_holidays_data,
          message: "Retrieved successfully",
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
  }

  async addHoliday(req, res, next) {
    try {
      const { holiday_name, holiday_date } = req.body;
      const newHoliday = await holidays.create({
        holiday_name,
        holiday_date,
        active: "Y",
      });

      if (!newHoliday) {
        return res.json({
          success: false,
          message: "Failed to add holiday",
        });
      }

      res.status(200).json({
        success: true,
        data: newHoliday,
        message: "Holiday added successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = holidaysDao;
