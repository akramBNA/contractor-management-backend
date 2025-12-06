const holidaysDao = require("../dao/holidays.dao");

const holidays_instance = new holidaysDao();

module.exports = {
  getAllHolidaysByYear: function (req, res, next) {
    holidays_instance.getAllHolidaysByYear(req, res, next);
  },
  addHoliday: function (req, res, next) {   
    holidays_instance.addHoliday(req, res, next);
  },
  updateHoliday: function (req, res, next) {   
    holidays_instance.updateHoliday(req, res, next);
  },
};
