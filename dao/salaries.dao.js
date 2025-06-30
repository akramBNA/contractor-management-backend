const employee_bank_details = require("../models/employee_bank_details.models");
const contracts = require("../models/contracts.models");

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
      const get_all_salaries_query = `SELECT account_holder_name,
                                    account_number,
                                    bank_name,
                                    branch_location
                                FROM employee_bank_details
                                WHERE active='Y'
                                ORDER BY bank_details_id ASC`;
      const get_all_salaries_data = await employee_bank_details.sequelize.query(
        get_all_salaries_query,
        {
          type: employee_bank_details.sequelize.QueryTypes.SELECT,
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
