const employee_bank_details = require("../models/employee_bank_details.models.js");

class employee_bank_detailsDao {
  async getAllEmployeeBankDetails(req, res, next) {
    try {
      const get_all_employee_bank_details_query = "SELECT * FROM employee_bank_details ORDER BY bank_details_id ASC";
      const get_all_employee_bank_details_data = await employee_bank_details.sequelize.query(
        get_all_employee_bank_details_query,
        {
          type: employee_bank_details.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_employee_bank_details_data) {
        res.status(200).json({
          status: true,
          Data: get_all_employee_bank_details_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          Data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = employee_bank_detailsDao;
