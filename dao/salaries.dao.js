const employee_bank_details = require("../models/employee_bank_details.models");
const contracts = require("../models/contracts.models");
const  employees  = require("../models/employees.models");

class salariesDao {
  // async getAllSalaries(req, res, next) {
  //   try {
  //     const get_all_salaries_query = `select employees.employee_name,
  //                                       employees.employee_lastname,
  //                                       contracts.salary
  //                                       from employees
  //                                       left join contracts
  //                                       ON employees.employee_contract_id = contracts.contract_id
  //                                       where employees.active = 'Y' AND contracts.active='Y'
  //                                       order by employees.employee_id ASC `;
  //     const get_all_salaries_data = await employees.sequelize.query(
  //       get_all_salaries_query,
  //       {
  //         type: employees.sequelize.QueryTypes.SELECT,
  //       }
  //     );

  //     if (get_all_salaries_data && get_all_salaries_data.length > 0) {
  //       res.status(200).json({
  //         success: true,
  //         data: get_all_salaries_data,
  //         message: "Salaries retrieved successfully",
  //       });
  //     } else {
  //       res.json({
  //         success: false,
  //         data: [],
  //         message: "No salaries found",
  //       });
  //     }
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  async getAllSalaries(req, res, next) {
    try {
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
                                    ORDER BY employee_bank_details.bank_details_id ASC `;
      const get_all_salaries_data = await employees.sequelize.query(
        get_all_salaries_query,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );

      if (get_all_salaries_data && get_all_salaries_data.length > 0) {
        res.status(200).json({
          success: true,
          data: get_all_salaries_data,
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
