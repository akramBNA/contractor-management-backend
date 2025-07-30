const leave_typesDao = require("../dao/leave_types.dao");

const leave_types_instance = new leave_typesDao();

module.exports = {
  getAllLeaveTypes: function (req, res, next) {
    leave_types_instance.getAllLeaveTypes(req, res, next);
  },
  addLeaveType: function (req, res, next) {
    leave_types_instance.addLeaveType(req, res, next);
  }
};
