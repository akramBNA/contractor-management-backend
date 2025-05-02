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

  //   async addOneEmployee(req, res, next) {
  //     try {
  //       // CONTRACTS & CONTRATCT TYPES
  //       const contract_type_id = req.body.contract_type_id || null;
  //       const salary = req.body.salary || null;

  //       // BANK DETAILS
  //       const account_holder_name = req.body.account_holder_name || null;
  //       const account_number = req.body.account_number || null;
  //       const bank_name = req.body.bank_name || null;
  //       const branch_location = req.body.branch_location || null;
  //       const tax_payer_id = req.body.tax_payer_id || null;

  //       // EMPLOYEES
  //       const employee_name = req.body.employee_name || null;
  //       const employee_lastname = req.body.employee_lastname || null;
  //       const employee_phone_number = req.body.employee_phone_number || null;
  //       const employee_email = req.body.employee_email || null;
  //       const employee_adress = req.body.employee_adress || null;
  //       const employee_national_id = req.body.employee_national_id || null;
  //       const employee_image_id = null;
  //       const employee_bank_details_id = null;
  //       const employee_contract_id = null;
  //       const employee_gender = req.body.employee_gender || null;
  //       const employee_birth_date = req.body.employee_birth_date || null;
  //       const employee_job_title = req.body.employee_job_title || null;
  //       const employee_joining_date = req.body.employee_joining_date || null;
  //       const employee_matricule = req.body.employee_matricule || null;

  //       // EMPLOYEES CONTRACT QUERY
  //       const insert_employee_contract_query = '';
  //       const insert_employee_contract_data = await employees.sequelize.query(
  //         insert_employee_contract_query,
  //         {
  //           type: employees.sequelize.QueryTypes.INSERT,
  //         }
  //       );

  //       // BANK DETAILS QUERY
  //       const insertemployee_bank_details_query = '';
  //       const insertemployee_bank_details_data = await employees.sequelize.query(
  //         insertemployee_bank_details_query,
  //         {
  //           type: employees.sequelize.QueryTypes.INSERT,
  //         }
  //       );

  //       // EMPLOYEES QUERY
  //       const insert_employee_query = '';
  //       const insert_employee_data = await employees.sequelize.query(
  //         insert_employee_query,
  //         {
  //           type: employees.sequelize.QueryTypes.INSERT,
  //         }
  //       );

  //     } catch (error) {
  //       return next(error);
  //     }
  // }

  async addOneEmployee(req, res, next) {
    const t = await employeesSequelize.transaction(); // Use the correct sequelize instance for transaction

    try {
      // CONTRACTS
      const contract_type_id = req.body.contract_type_id || null;
      const salary = req.body.salary || null;

      // Use the correct sequelize instance for contracts
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
      

      // EMPLOYEE BANK DETAILS
      const {
        account_holder_name = null,
        account_number = null,
        bank_name = null,
        branch_location = null,
        tax_payer_id = null,
      } = req.body;

      // Use the correct sequelize instance for employee_bank_details
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
      

      // EMPLOYEES
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

      // Use the correct sequelize instance for employees
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
