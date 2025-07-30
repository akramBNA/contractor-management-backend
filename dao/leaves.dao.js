const leaves = require("../models/leaves.models");

class leavesDao {
  async getAllLeaves(req, res, next) {
    try {
      const get_all_leaves_query = "SELECT * FROM leaves WHERE active='Y' ORDER BY leave_id ASC";
      const get_all_leaves_data = await leaves.sequelize.query(
        get_all_leaves_query,
        {
          type: leaves.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_leaves_data) {
        res.status(200).json({
          status: true,
          data: get_all_leaves_data,
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

module.exports = leavesDao;
