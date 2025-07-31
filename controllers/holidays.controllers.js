const holidaysDao = require("../dao/holidays.dao");

const holidays_instance = new holidaysDao();

module.exports = {
  getAllholidays: function (req, res, next) {
    holidays_instance.getAllholidays(req, res, next);
  },
};
