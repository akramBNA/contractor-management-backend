const leavesDao = require("../dao/leaves.dao");

const leaves_instance = new leavesDao();

module.exports = {
  getAllLeaves: function (req, res, next) {
    leaves_instance.getAllLeaves(req, res, next);
  },
  requestLeave: function (req, res, next) {
    leaves_instance.requestLeave(req, res, next);
  },
  getAllLeavesById: function (req, res, next) {
    leaves_instance.getAllLeavesById(req, res, next);
  },
  acceptLeaves: function (req, res, next) {
    leaves_instance.acceptLeaves(req, res, next);
  },
  rejectLeaves: function (req, res, next) {
    leaves_instance.rejectLeaves(req, res, next);
  },
  deleteLeaves: function (req, res, next) {
    leaves_instance.deleteLeaves(req, res, next);
  },
  resetEmployeeCreditLeave: function (req, res, next) {
    leaves_instance.resetEmployeeCreditLeave(req, res, next);
  }
};
