const { leaves } = require("../models/leaves.models");
const { employees } = require("../models/employees.models");

class leavesDao {
  async getAllLeaves(req, res, next) {
    try {
      const get_all_leaves_query ="SELECT * FROM leaves WHERE active='Y' ORDER BY leave_id ASC";
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

  isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  calculateWeekdaysOnly(start, end) {
    let count = 0;
    let current = new Date(start);

    while (current <= end) {
      if (!this.isWeekend(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
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

      const start = new Date(start_date);
      const end = new Date(end_date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (start < today) {
        return res.json({
          status: false,
          message: "Start date cannot be before today",
        });
      }

      if (end < start) {
        return res.json({
          status: false,
          message: "End date must be after start date",
        });
      }

      const weekdays = this.calculateWeekdaysOnly(start, end);

      if (weekdays <= 0) {
        return res.json({
          status: false,
          message: "Leave duration must include at least one weekday",
        });
      }

      const employee = await employees.findOne({ where: { employee_id } });

      if (!employee) {
        return res.json({
          status: false,
          message: "Employee not found",
        });
      }

      if (employee.leave_credit < weekdays) {
        return res.json({
          status: false,
          message: "Insufficient leave credit",
        });
      }

      const leave = await leaves.create({
        employee_id,
        leave_type_id,
        description,
        start_date: start,
        end_date: end,
        duration: weekdays,
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
