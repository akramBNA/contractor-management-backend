const hr_statsDao = require("../dao/hr_stats.dao");

const hr_stats_instance = new hr_statsDao();

module.exports = {
  hrStatistics: function (req, res, next) {
    hr_stats_instance.hrStatistics(req, res, next);
  },
};
