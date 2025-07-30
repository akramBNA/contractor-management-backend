const leave_types = require("../models/leave_types.models");

class leave_typesDao {
  async getAllLeaveTypes(req, res, next) {
    try {
      const get_all_leave_types_query = "SELECT * FROM leave_types WHERE active='Y' ORDER BY leave_type_id ASC";
      const get_all_leave_types_data = await leave_types.sequelize.query(
        get_all_leave_types_query,
        {
          type: leave_types.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_leave_types_data) {
        res.status(200).json({
          status: true,
          data: get_all_leave_types_data,
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
  };

  async addLeaveType(req, res, next) {
    try {
      const { leave_type_name } = req.body;
      const newLeaveType = await leave_types.create({
       leave_type_name
      });

      res.status(200).json({
        status: true,
        data: newLeaveType,
        message: "Leave type created successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = leave_typesDao;
