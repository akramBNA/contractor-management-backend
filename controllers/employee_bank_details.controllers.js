const employee_bank_detailsDao = require("../dao/employee_bank_details.dao.js");

const employee_bank_details_instance = new employee_bank_detailsDao();

module.exports = {
    getAllEmployeeBankDetails: function (req, res, next) {
    employee_bank_details_instance.getAllEmployeeBankDetails(req, res, next);
  },
};
