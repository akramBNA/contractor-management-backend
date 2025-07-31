const {holidays} = require("../models/holidays.models");

class holidaysDao {
  async getAllHolidays(req, res, next) {
    try {
      const get_all_holidays_query = "SELECT * FROM holidays WHERE active='Y' ORDER BY holiday_id ASC";
      const get_all_holidays_data = await holidays.sequelize.query(
        get_all_holidays_query,
        {
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
      
      if(!newHoliday) {
        return res.json({
          success: false,
          message: "Failed to add holiday",
        });
      };

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
