const { ca, da } = require("date-fns/locale");
const { attendances } = require("../models/attendances.models");

class attendancesDao {
  async receiveRFIDAttendance(req, res, next) {
    try {
      const { deviceId, cardUid, action } = req.body;

      if (!deviceId || !cardUid || !action) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Missing attendance data",
        });
      }

      if (action !== "LOGIN" && action !== "LOGOUT") {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Invalid attendance action",
        });
      }

      const find_employee_query = `
      SELECT 
        e.employee_id,
        e.first_name,
        e.last_name
      FROM employees e
      INNER JOIN rfid_cards r
        ON r.employee_id = e.employee_id
      WHERE r.card_uid = :cardUid
        AND r.active = 'Y'
        AND e.active = 'Y'
      LIMIT 1
    `;

      const employee = await employees.sequelize.query(find_employee_query, {
        replacements: { cardUid },
        type: employees.sequelize.QueryTypes.SELECT,
      });

      if (!employee || employee.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "RFID card is not registered",
        });
      }

      const employeeData = employee[0];

      const insert_attendance_query = `
      INSERT INTO attendance (
        employee_id,
        device_id,
        attendance_type,
        attendance_date
      )
      VALUES (
        :employeeId,
        :deviceId,
        :action,
        NOW()
      )
      RETURNING *
    `;

      const attendance = await attendance.sequelize.query(
        insert_attendance_query,
        {
          replacements: {
            employeeId: employeeData.employee_id,
            deviceId,
            action,
          },
          type: attendance.sequelize.QueryTypes.SELECT,
        },
      );

      if (attendance && attendance.length > 0) {
        return res.status(201).json({
          success: true,
          data: {
            employee: {
              employee_id: employeeData.employee_id,
              first_name: employeeData.first_name,
              last_name: employeeData.last_name,
            },
            attendance: attendance[0],
          },
          message:
            action === "LOGIN"
              ? `Welcome ${employeeData.first_name}`
              : `Goodbye ${employeeData.first_name}`,
        });
      } else {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Failed to record attendance",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = attendancesDao;
