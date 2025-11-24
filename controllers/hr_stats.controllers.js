const hr_statsDao = require("../dao/hr_stats.dao");

const hr_stats_instance = new hr_statsDao();

module.exports = {
  getAllEmployeesBirthdaysForThisMonth: function (req, res, next) {
    hr_stats_instance.getAllEmployeesBirthdaysForThisMonth(req, res, next);
  },
};
