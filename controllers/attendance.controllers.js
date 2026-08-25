const attendancesDAO = require("../dao/attendances.dao.js");

const attendance_instance = new attendancesDAO();

module.exports = {
  receiveRFIDAttendance: function (req, res, next) {
    attendance_instance.receiveRFIDAttendance(req, res, next);
  },
};
