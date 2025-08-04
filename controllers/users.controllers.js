const usersDao = require("../dao/users.dao.js");
const users_instance = new usersDao();

module.exports = {
  getAllUsers: function (req, res, next) {
    users_instance.getAllUsers(req, res, next);
  },
  addUser: function (req, res, next) {
    users_instance.addUser(req, res, next);
  },
  UserLogin: function (req, res, next) {
    users_instance.UserLogin(req, res, next);
  },
  getUserDataByIdAfterLogin: function (req, res, next) {
    users_instance.getUserDataByIdAfterLogin(req, res, next);
  },
  getUserById: function (req, res, next) {
    users_instance.getUserById(req, res, next);
  },
  updateUser: function (req, res, next) {
    users_instance.updateUser(req, res, next);
  },
  deleteUser: function (req, res, next) {
    users_instance.deleteUser(req, res, next);
  },
  signupWithEmployeeEmail: function (req, res, next) {
    users_instance.signupWithEmployeeEmail(req, res, next);
  },
  updateUserRole: function (req, res, next) {
    users_instance.updateUserRole(req, res, next);
  }
};
