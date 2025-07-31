const holidaysDao = require("../dao/holidays.dao");

const holidays_instance = new holidaysDao();

module.exports = {
  getAllHolidays: function (req, res, next) {
    holidays_instance.getAllHolidays(req, res, next);
  },
};
