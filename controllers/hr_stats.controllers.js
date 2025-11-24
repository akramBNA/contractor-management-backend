const hr_statsDao = require("../dao/hr_stats.dao");

const hr_stats_instance = new hr_statsDao();

module.exports = {
  getAllEmployeesBirthdays: function (req, res, next) {
    hr_stats_instance.getAllEmployeesBirthdays(req, res, next);
  },
};
