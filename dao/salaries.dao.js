const employee_bank_details = require("../models/employee_bank_details.models");
const contracts = require("../models/contracts.models");
const employees = require("../models/employees.models");

class salariesDao {
  async getAllSalaries(req, res, next) {
    
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const keyWord = params.keyWord || "";
      const limit = parseInt(params.limit) || 20;
      const offset = parseInt(params.offset) || 0;

      const total_salaries_query = `SELECT COUNT(*) AS total FROM employees WHERE active='Y'`;
      const total_salaries_data = await employees.sequelize.query(
        total_salaries_query,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );

      const searchCondition = keyWord ? `AND employee_bank_details.account_holder_name ILIKE '${keyWord}%'` : "";

      const get_all_salaries_query = `SELECT 
                                        employee_bank_details.account_holder_name,
                                        employee_bank_details.account_number,
                                        employee_bank_details.bank_name,
                                        employee_bank_details.branch_location,
                                        contracts.salary
                                    FROM employees
                                    LEFT JOIN contracts
                                    ON employees.employee_contract_id = contracts.contract_id
                                    LEFT JOIN employee_bank_details
                                    ON employees.employee_bank_details_id = employee_bank_details.bank_details_id
                                    WHERE employees.active='Y' AND contracts.active='Y' AND employee_bank_details.active='Y'
                                    ${searchCondition}
                                    ORDER BY employee_bank_details.bank_details_id ASC
                                    LIMIT ${limit}
                                    OFFSET ${offset} `;
      const get_all_salaries_data = await employees.sequelize.query(
        get_all_salaries_query,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );

      const total = parseInt(total_salaries_data[0].total);

      if (get_all_salaries_data && get_all_salaries_data.length > 0) {
        res.status(200).json({
          success: true,
          data: get_all_salaries_data,
          attributes: {
            total: total,
            limit: limit,
            offset: offset,
            pages: Math.ceil(total / limit),
          },
          message: "Salaries retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "No salaries found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = salariesDao;
