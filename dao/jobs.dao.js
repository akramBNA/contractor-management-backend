const jobs = require("../models/jobs.models");

class jobsDao {
  async getAllJobs(req, res, next) {
    try {
      const get_all_jobs_query = "SELECT * FROM jobs WHERE active='Y' ORDER BY job_id ASC";
      const get_all_jobs_data = await jobs.sequelize.query(
        get_all_jobs_query,
        {
          type: jobs.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_jobs_data) {
        res.status(200).json({
          status: true,
          data: get_all_jobs_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = jobsDao;
