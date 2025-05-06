const { employees, sequelize: employeesSequelize } = require("../models/employees.models");
const { contracts, sequelize: contractsSequelize } = require("../models/contracts.models");
const { employee_bank_details, sequelize: bankDetailsSequelize } = require("../models/employee_bank_details.models");

class employeesDao {
  async getAllemployees(req, res, next) {
    try {
      const get_all_employees_query =
        "SELECT * FROM employees ORDER BY employee_id ASC";
      const get_all_employees_data = await employees.sequelize.query(
        get_all_employees_query,
        {
          type: employees.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_employees_data) {
        res.status(200).json({
          status: true,
          Data: get_all_employees_data,
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

  async addOneEmployee(req, res, next) {
    const t = await employeesSequelize.transaction();

    try {
      const contract_type_id = req.body.contract_type_id || null;
      const salary = req.body.salary || null;

      const [contractResult] = await contractsSequelize.query(
        `INSERT INTO contracts (contract_type_id, salary)
         VALUES (:contract_type_id, :salary)
         RETURNING contract_id;`,
        {
          replacements: { contract_type_id, salary },
          type: contractsSequelize.QueryTypes.INSERT,
          transaction: t,
        }
      );
      const contract_id = contractResult[0].contract_id;
      console.log("Contract ID:", contract_id);
      

      const {
        account_holder_name = null,
        account_number = null,
        bank_name = null,
        branch_location = null,
        tax_payer_id = null,
      } = req.body;

      const [bankResult] = await bankDetailsSequelize.query(
        `INSERT INTO employee_bank_details (
          account_holder_name, account_number,
          bank_name, branch_location, tax_payer_id
        )
        VALUES (
          :account_holder_name, :account_number,
          :bank_name, :branch_location, :tax_payer_id
        )
        RETURNING bank_details_id;`,
        {
          replacements: {
            account_holder_name,
            account_number,
            bank_name,
            branch_location,
            tax_payer_id,
          },
          type: bankDetailsSequelize.QueryTypes.INSERT,
          transaction: t,
        }
      );
      const bank_details_id = bankResult[0].bank_details_id;
      console.log("Bank Details ID:", bank_details_id);
      

      const {
        employee_name = null,
        employee_lastname = null,
        employee_phone_number = null,
        employee_email = null,
        employee_adress = null,
        employee_national_id = null,
        employee_gender = null,
        employee_birth_date = null,
        employee_job_title = null,
        employee_joining_date = null,
        employee_matricule = null,
      } = req.body;

      await employeesSequelize.query(
        `INSERT INTO employees (
          employee_name, employee_lastname, employee_phone_number,
          employee_email, employee_adress, employee_national_id,
          employee_image_id, employee_bank_details_id,
          employee_contract_id, employee_gender,
          employee_birth_date, employee_job_title,
          employee_joining_date, employee_matricule
        )
        VALUES (
          :employee_name, :employee_lastname, :employee_phone_number,
          :employee_email, :employee_adress, :employee_national_id,
          NULL, :bank_details_id,
          :contract_id, :employee_gender,
          :employee_birth_date, :employee_job_title,
          :employee_joining_date, :employee_matricule
        );`,
        {
          replacements: {
            employee_name,
            employee_lastname,
            employee_phone_number,
            employee_email,
            employee_adress,
            employee_national_id,
            bank_details_id,
            contract_id,
            employee_gender,
            employee_birth_date,
            employee_job_title,
            employee_joining_date,
            employee_matricule,
          },
          type: employeesSequelize.QueryTypes.INSERT,
          transaction: t,
        }
      );

      await t.commit();
      return res.status(201).json({ message: "Employee added successfully!" });
    } catch (error) {
      await t.rollback();
      console.error("Error in addOneEmployee:", error);
      
      return next(error);
    }
  }
}

module.exports = employeesDao;
