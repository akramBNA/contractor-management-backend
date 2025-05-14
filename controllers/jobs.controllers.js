const jobsDao = require("../dao/jobs.dao");

const jobs_instance = new jobsDao();

module.exports = {
  getAllJobs: function (req, res, next) {
    jobs_instance.getAllJobs(req, res, next);
  },
};
