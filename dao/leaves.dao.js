const leaves = require("../models/leaves.models");
const employees = require("../models/employees.models");

class leavesDao {
  async getAllLeaves(req, res, next) {
    try {
      const get_all_leaves_query =
        "SELECT * FROM leaves WHERE active='Y' ORDER BY leave_id ASC";
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

  async requestLeave(req, res, next) {
    try {
      const { employee_id, leave_type_id, description, start_date, end_date } =
        req.body;

      if (!employee_id || !leave_type_id || !start_date || !end_date) {
        return res.json({
          status: false,
          message:
            "Missing required fields: employee_id, leave_type_id, start_date, end_date",
        });
      }

      const durationInDays = Math.ceil(
        (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1
      );

      if (durationInDays <= 0) {
        return res.json({
          status: false,
          message: "End date must be after start date",
        });
      }

      const employee = await employees.findOne({ where: { employee_id } });

      if (!employee) {
        return res.json({
          status: false,
          message: "Employee not found",
        });
      }

      if (employee.leave_credit < durationInDays) {
        return res.json({
          status: false,
          message: "Insufficient leave credit",
        });
      }

      const leave = await leaves.create({
        employee_id,
        leave_type_id,
        description,
        start_date,
        end_date,
        duration: durationInDays,
        status: "Pending",
      });

      res.status(200).json({
        status: true,
        data: leave,
        message: "Leave request created successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = leavesDao;
