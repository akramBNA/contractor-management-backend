const { leaves } = require("../models/leaves.models");
const { employees } = require("../models/employees.models");
const { holidays } = require("../models/holidays.models");
const { Op } = require("sequelize");


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

  // async requestLeave(req, res, next) {
  //   try {
  //     const { employee_id, leave_type_id, description, start_date, end_date } =
  //       req.body;

  //     if (!employee_id || !leave_type_id || !start_date || !end_date) {
  //       return res.json({
  //         success: false,
  //         message:"Missing required fields: employee_id, leave_type_id, start_date, end_date",
  //       });
  //     }

  //     const start = new Date(start_date);
  //     const end = new Date(end_date);
  //     const today = new Date();

  //     today.setHours(0, 0, 0, 0);
  //     start.setHours(0, 0, 0, 0);
  //     end.setHours(0, 0, 0, 0);

  //     if (start < today) {
  //       return res.json({
  //         success: false,
  //         message: "Start date cannot be before today",
  //       });
  //     }

  //     if (end < start) {
  //       return res.json({
  //         success: false,
  //         message: "End date must be after start date",
  //       });
  //     }

  //     const weekdays = this.calculateWeekdaysOnly(start, end);

  //     if (weekdays <= 0) {
  //       return res.json({
  //         success: false,
  //         message: "Leave duration must include at least one weekday",
  //       });
  //     }

  //     const employee = await employees.findOne({ where: { employee_id } });

  //     if (!employee) {
  //       return res.json({
  //         success: false,
  //         message: "Employee not found",
  //       });
  //     }

  //     if (employee.leave_credit < weekdays) {
  //       return res.json({
  //         success: false,
  //         message: "Insufficient leave credit",
  //       });
  //     }

  //     const leave = await leaves.create({
  //       employee_id,
  //       leave_type_id,
  //       description,
  //       start_date: start,
  //       end_date: end,
  //       duration: weekdays,
  //       status: "Pending",
  //     });

  //     res.status(200).json({
  //       success: true,
  //       data: leave,
  //       message: "Leave request created successfully",
  //     });
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  async requestLeave(req, res, next) {
    try {
      const { employee_id, leave_type_id, description, start_date, end_date } = req.body;

      if (!employee_id || !leave_type_id || !start_date || !end_date) {
        return res.json({
          success: false,
          message: "Missing required fields: employee_id, leave_type_id, start_date, end_date",
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
          success: false,
          message: "Start date cannot be before today",
        });
      }

      if (end < start) {
        return res.json({
          success: false,
          message: "End date must be after start date",
        });
      }

      const weekdays = this.calculateWeekdaysOnly(start, end);

      if (weekdays <= 0) {
        return res.json({
          success: false,
          message: "Leave duration must include at least one weekday",
        });
      }

      const holidayList = await holidays.findAll({
        where: {
          holiday_date: {
            [Op.between]: [start, end],
          },
          active: 'Y',
        },
      });

      const holidayWeekdays = holidayList.filter(h => {
        const d = new Date(h.holiday_date);
        const day = d.getDay();
        return day !== 0 && day !== 6;
      });

      const adjustedLeaveDays = weekdays - holidayWeekdays.length;

      if (adjustedLeaveDays <= 0) {
        return res.json({
          success: false,
          message: "All selected days are holidays or weekends. Leave duration must include valid weekdays.",
        });
      }

      const employee = await employees.findOne({ where: { employee_id } });

      if (!employee) {
        return res.json({
          success: false,
          message: "Employee not found",
        });
      }

      if (employee.leave_credit < adjustedLeaveDays) {
        return res.json({
          success: false,
          message: "Insufficient leave credit",
        });
      }

      const leave = await leaves.create({
        employee_id,
        leave_type_id,
        description,
        start_date: start,
        end_date: end,
        duration: adjustedLeaveDays,
        status: "Pending",
      });

      return res.status(200).json({
        success: true,
        data: leave,
        message: "Leave request created successfully (excluding holidays)",
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAllLeavesById(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

        const employee_id = params.employee_id;
        const limit = params.limit || 20;
        const offset = params.offset || 0;

        const get_all_leaves_by_id_count_query = `SELECT COUNT(*) as total FROM leaves WHERE employee_id = :employee_id AND active='Y'`;
        const get_all_leaves_by_id_count_data = await leaves.sequelize.query(get_all_leaves_by_id_count_query, {
            replacements: { employee_id },
            type: leaves.sequelize.QueryTypes.SELECT,
        });
        
        if(!get_all_leaves_by_id_count_data || get_all_leaves_by_id_count_data[0].total === 0) {
          return res.json({
            success: true,
            data: [],
            message: "No leaves found for this employee",
          });
        };

        const get_all_leaves_by_id_query = `SELECT l.description,
                                                    l.duration,
                                                    l.start_date,
                                                    l.end_date,
                                                    l.status,
                                                    lt.leave_type_name
                                            FROM leaves as l 
											LEFT JOIN leave_types as lt
											ON l.leave_type_id = lt.leave_type_id
                                            WHERE employee_id = :employee_id AND l.active='Y' AND lt.active='Y'
                                            ORDER BY leave_id ASC 
                                            LIMIT :limit OFFSET :offset`;
        const get_all_leaves_by_id_data = await leaves.sequelize.query(
          get_all_leaves_by_id_query,
          {
            replacements: {
              employee_id,
              limit,
              offset,
            },
            type: leaves.sequelize.QueryTypes.SELECT,
          });

          if(get_all_leaves_by_id_data && get_all_leaves_by_id_data.length > 0) {
            res.status(200).json({
              success: true,
              data: get_all_leaves_by_id_data,
              attributes:{
                total: parseInt(get_all_leaves_by_id_count_data[0].total),
                limit: limit,
                offset: offset,
              },
              stats: {},
              message: "Retrieved successfully",
            });
          }
          else {
            res.json({
              success: true,
              data: [],
              message: "No leaves found for this employee",
            });
          }

    } catch (error) {
      return next(error);
    }
  }

  async acceptLeaves(req, res, next) {
    const t = await sequelize.transaction();
    try {

      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const leave_id = params.leave_id;
      const employee_id = params.employee_id;

      if (!leave_id) {
        return res.json({
          success: false,
          message: "Missing required field: leave_id",
        });
      }

      const leave = await leaves.findOne({ where: { leave_id, active: 'Y' }, transaction: t });

      if (!leave || leave.status !== "Pending") {
        return res.json({
          success: false,
          message: "Leave request not found or already processed",
        });
      }

      const employee = await employees.findOne({ where: { employee_id }, transaction: t });

      if (!employee) {
        return res.json({
          success: false,
          message: "Employee not found",
        });
      }

      if (employee.leave_credit < leave.duration) {
        return res.json({
          success: false,
          message: "Insufficient leave credit",
        });
      }

      leave.status = "Approved";
      await leave.save({ transaction: t });

      await employees.update(
        { leave_credit: employee.leave_credit - leave.duration },
        { where: { employee_id }, transaction: t }
      );

      await t.commit();

      res.status(200).json({
        success: true,
        data: leave,
        message: "Leave request approved successfully",
      });

    } catch (error) {
      await t.rollback();
      return next(error);
    }
  }

  async declineLeaves(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const leave_id = params.leave_id;

      if (!leave_id) {
        return res.json({
          success: false,
          message: "Missing required field: leave_id",
        });
      }

      const leave = await leaves.findOne({ where: { leave_id, active: 'Y' } });

      if (!leave) {
        return res.json({
          success: false,
          message: "Leave request not found or already processed",
        });
      }

      leave.status = "Rejected";
      await leave.save();

      res.status(200).json({
        success: true,
        data: leave,
        message: "Leave request rejected successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = leavesDao;
