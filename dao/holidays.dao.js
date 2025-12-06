const { DATE } = require("sequelize");
const { holidays } = require("../models/holidays.models");

class holidaysDao {
  async getAllHolidaysByYear(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const get_all_holidays_count_query = `SELECT COUNT(*) as total FROM holidays WHERE active='Y'`;
      const get_all_holidays_count_data = await holidays.sequelize.query(get_all_holidays_count_query, {
        type: holidays.sequelize.QueryTypes.SELECT,
      });

      if(!get_all_holidays_count_data || get_all_holidays_count_data[0].total === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No holidays found",
        });
      };

      const get_available_years_query = `SELECT DISTINCT EXTRACT(YEAR FROM holiday_date) as year FROM holidays WHERE active='Y' ORDER BY year DESC`;
      const available_years_data = await holidays.sequelize.query(get_available_years_query, {
        type: holidays.sequelize.QueryTypes.SELECT,
      });

      const year = params.year || new Date().getFullYear();
      if (!year || isNaN(year)) {
        return res.json({
          success: false,
          message: "Invalid year provided",
        });
      };
      
      const get_all_holidays_by_year_query = `SELECT * FROM holidays WHERE active='Y' AND EXTRACT(YEAR FROM holiday_date) = :year ORDER BY holiday_date ASC`;
      const get_all_holidays_by_year_data = await holidays.sequelize.query(
        get_all_holidays_by_year_query,
        {
          replacements: { year },
          type: holidays.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_holidays_by_year_data) {
        res.status(200).json({
          success: true,
          data: get_all_holidays_by_year_data,
          years: available_years_data.map(y => y.year),
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
  };

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
  };

  async updateHoliday(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const  holiday_id  = params.holiday_id;
      const { holiday_name, holiday_date } = req.body;      

      if (!holiday_id || isNaN(holiday_id)) {
        return res.json({
          success: false,
          data: [],
          message: "Invalid holiday ID",
        });
      }

      const updateData = {};
      if (holiday_name && holiday_name.trim()) updateData.holiday_name = holiday_name.trim();
      if (holiday_date && holiday_date.trim()) updateData.holiday_date = holiday_date;

      if (Object.keys(updateData).length === 0) {
        return res.json({
          success: false,
          data: [],
          message: "No valid fields to update",
        });
      }

      const [updated] = await holidays.update(updateData, {
        where: { holiday_id, active: "Y" },
      });

      if (!updated) {
        return res.json({
          success: false,
          data: [],
          message: "Holiday not found or no update performed",
        });
      }

      const updatedHoliday = await holidays.findOne({
        where: { holiday_id },
      });

      return res.status(200).json({
        success: true,
        data: updatedHoliday,
        message: "Holiday updated successfully",
      });

    } catch (error) {
      return next(error);
    }
  };

}

module.exports = holidaysDao;
