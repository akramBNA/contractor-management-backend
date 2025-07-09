const { employees, sequelize: employeesSequelize } = require("../models/employees.models");
const { contracts, sequelize: contractsSequelize,} = require("../models/contracts.models");
const { employee_bank_details, sequelize: bankDetailsSequelize,} = require("../models/employee_bank_details.models");
const { contract_types, sequelize: contractTypesSequelize,} = require("../models/contract_types.models");
const { Op, Sequelize } = require("sequelize");

class employeesDao {
  async getAllEmployees(req, res, next) {
    try {
      const { limit = 20, offset = 0, keyword = "" } = req.query;

      const activeCount = await employees.count({ where: { active: "Y" } });
      
      if (activeCount === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No employees found",
        });
      }

      const searchCondition = keyword
        ? {
            [Op.or]: [
              { employee_name: { [Op.iLike]: `%${keyword}%` } },
              { employee_lastname: { [Op.iLike]: `%${keyword}%` } },
              { employee_email: { [Op.iLike]: `%${keyword}%` } },
            ],
          }
        : {};

      const whereCondition = {
        active: "Y",
        ...searchCondition,
      };

      const employeesData = await employees.findAll({
        attributes: [
          "employee_id",
          "employee_matricule",
          "employee_name",
          "employee_lastname",
          "employee_email",
          "employee_address",
          "employee_job_title",
          "employee_phone_number",
        ],
        where: whereCondition,
        order: [["employee_id", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const [totalCount, maleCount, femaleCount, newEmployeesCount] =
        await Promise.all([
          employees.count({ where: { active: "Y" } }),
          employees.count({ where: { active: "Y", employee_gender: "Male" } }),
          employees.count({
            where: { active: "Y", employee_gender: "Female" },
          }),
          employees.count({
            where: {
              active: "Y",
              employee_joining_date: {
                [Op.gte]: Sequelize.literal(
                  "CURRENT_DATE - INTERVAL '1 MONTH'"
                ),
              },
            },
          }),
        ]);

      return res.status(200).json({
        success: true,
        data: employeesData,
        statistics: {
          total: totalCount,
          male: maleCount,
          female: femaleCount,
          newEmployees: newEmployeesCount,
        },
        message: "Retrieved successfully",
      });
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
        employee_address = null,
        employee_national_id = null,
        employee_gender = null,
        employee_birth_date = null,
        employee_job_title = null,
        employee_joining_date = null,
        employee_end_date = null,
        employee_matricule = null,
      } = req.body;

      await employeesSequelize.query(
        `INSERT INTO employees (
          employee_name, employee_lastname, employee_phone_number,
          employee_email, employee_address, employee_national_id,
          employee_image_id, employee_bank_details_id,
          employee_contract_id, employee_gender,
          employee_birth_date, employee_job_title,
          employee_joining_date, employee_end_date, employee_matricule
        )
        VALUES (
          :employee_name, :employee_lastname, :employee_phone_number,
          :employee_email, :employee_address, :employee_national_id,
          NULL, :bank_details_id,
          :contract_id, :employee_gender,
          :employee_birth_date, :employee_job_title,
          :employee_joining_date, :employee_end_date, :employee_matricule
        );`,
        {
          replacements: {
            employee_name,
            employee_lastname,
            employee_phone_number,
            employee_email,
            employee_address,
            employee_national_id,
            bank_details_id,
            contract_id,
            employee_gender,
            employee_birth_date,
            employee_job_title,
            employee_joining_date,
            employee_end_date,
            employee_matricule,
          },
          type: employeesSequelize.QueryTypes.INSERT,
          transaction: t,
        }
      );

      await t.commit();
      return res.status(201).json({
        success: true,
        data: [],
        message: "Employee added successfully!",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error in addOneEmployee:", error);

      return next(error);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);

      const employee_data = await employees.findOne({
        where: {
          employee_id: id,
          active: "Y",
        },
      });

      if (!employee_data) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Employee not found or inactive",
        });
      }

      const contracts_query = `SELECT 
                employees.employee_id,
                employees.employee_name,
                employees.employee_lastname,
                employees.employee_phone_number,
                employees.employee_email,
                employees.employee_address,
                employees.employee_national_id  ,
                employees.employee_gender,
                employees.employee_birth_date,
                employees.employee_job_title,
                employees.employee_matricule,
                employees.employee_joining_date,
                employees.employee_end_date,
                employees.employee_bank_details_id,
                employees.employee_contract_id,
                
                contracts.salary,
                
                contract_types.contract_type_id,
                contract_types.contract_name,
                
                employee_bank_details.account_holder_name,
                employee_bank_details.account_number,
                employee_bank_details.bank_name,
                employee_bank_details.branch_location,
                employee_bank_details.tax_payer_id
                
              FROM employees
              JOIN contracts 
                ON contracts.contract_id = employees.employee_contract_id
              LEFT JOIN contract_types 
                ON contracts.contract_type_id = contract_types.contract_type_id
              LEFT JOIN employee_bank_details 
                ON employee_bank_details.bank_details_id = employees.employee_bank_details_id
              WHERE
                employees.employee_id = :id
                AND contracts.active = 'Y' 
                AND contract_types.active = 'Y';
            `;

      const employee_data_2 = await employeesSequelize.query(contracts_query, {
        replacements: { id },
        type: employeesSequelize.QueryTypes.SELECT,
      });

      return res.status(200).json({
        success: true,
        data: employee_data_2[0],
        message: "Employee data retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async getJobsAndContractTypes(req, res, next) {
    try {
      const jobs_query =
        "SELECT * FROM jobs WHERE active='Y' ORDER BY job_id ASC";
      const contract_types_query =
        "SELECT * FROM contract_types WHERE active='Y' ORDER BY contract_type_id ASC";

      const [jobs, contract_types] = await Promise.all([
        employeesSequelize.query(jobs_query, {
          type: employeesSequelize.QueryTypes.SELECT,
        }),
        employeesSequelize.query(contract_types_query, {
          type: employeesSequelize.QueryTypes.SELECT,
        }),
      ]);

      return res.status(200).json({
        success: true,
        data_jobs: jobs,
        data_contract_types: contract_types,
        message: "Retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  async editEmployee(req, res, next) {
    const t = await employeesSequelize.transaction();

    try {
      const employee_id = req.params.id || req.body.employee_id;
      if (!employee_id) throw new Error("Employee ID is required");

      const [employeeData] = await employeesSequelize.query(
        `SELECT employee_contract_id AS contract_id,
              employee_bank_details_id AS bank_details_id
       FROM employees
       WHERE employee_id = :employee_id AND active = 'Y';`,
        {
          replacements: { employee_id },
          type: employeesSequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (!employeeData) {
        throw new Error("Employee not found or inactive");
      }

      const { contract_id, bank_details_id } = employeeData;

      const contractUpdates = {};
      if (req.body.contract_type_id !== undefined)
        contractUpdates.contract_type_id = req.body.contract_type_id;
      if (req.body.salary !== undefined)
        contractUpdates.salary = req.body.salary;

      if (Object.keys(contractUpdates).length > 0) {
        const contractFields = Object.keys(contractUpdates)
          .map((key) => `${key} = :${key}`)
          .join(", ");

        await contractsSequelize.query(
          `UPDATE contracts SET ${contractFields} WHERE contract_id = :contract_id`,
          {
            replacements: { ...contractUpdates, contract_id },
            type: contractsSequelize.QueryTypes.UPDATE,
            transaction: t,
          }
        );
      }

      const bankUpdates = {};
      [
        "account_holder_name",
        "account_number",
        "bank_name",
        "branch_location",
        "tax_payer_id",
      ].forEach((key) => {
        if (req.body[key] !== undefined) bankUpdates[key] = req.body[key];
      });

      if (Object.keys(bankUpdates).length > 0) {
        const bankFields = Object.keys(bankUpdates)
          .map((key) => `${key} = :${key}`)
          .join(", ");

        await bankDetailsSequelize.query(
          `UPDATE employee_bank_details SET ${bankFields} WHERE bank_details_id = :bank_details_id`,
          {
            replacements: { ...bankUpdates, bank_details_id },
            type: bankDetailsSequelize.QueryTypes.UPDATE,
            transaction: t,
          }
        );
      }

      const employeeUpdates = {};
      [
        "employee_name",
        "employee_lastname",
        "employee_phone_number",
        "employee_email",
        "employee_address",
        "employee_national_id",
        "employee_gender",
        "employee_birth_date",
        "employee_job_title",
        "employee_joining_date",
        "employee_end_date",
        "employee_matricule",
      ].forEach((key) => {
        if (req.body[key] !== undefined) employeeUpdates[key] = req.body[key];
      });

      if (Object.keys(employeeUpdates).length > 0) {
        const empFields = Object.keys(employeeUpdates)
          .map((key) => `${key} = :${key}`)
          .join(", ");

        await employeesSequelize.query(
          `UPDATE employees SET ${empFields} WHERE employee_id = :employee_id`,
          {
            replacements: { ...employeeUpdates, employee_id },
            type: employeesSequelize.QueryTypes.UPDATE,
            transaction: t,
          }
        );
      }

      await t.commit();
      return res.status(200).json({
        success: true,
        message: "Employee updated successfully!",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error in editEmployee:", error);
      return next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const employee_id = req.params.id;

      const employee_data_query = `SELECT employees.employee_id, contracts.contract_id, employee_bank_details.bank_details_id 
      FROM employees LEFT JOIN contracts on employees.employee_contract_id = contracts.contract_id 
      LEFT JOIN employee_bank_details on employees.employee_bank_details_id = employee_bank_details.bank_details_id 
      WHERE employees.employee_id = :employee_id AND employees.active = 'Y';`;

      const employee_data = await employeesSequelize.query(
        employee_data_query,
        {
          replacements: { employee_id },
          type: employeesSequelize.QueryTypes.SELECT,
        }
      );

      if (employee_data.length) {
        const contract_id = employee_data[0].contract_id;
        const bank_details_id = employee_data[0].bank_details_id;

        const delete_contract_query = `UPDATE contracts SET active = 'N' WHERE contract_id = :contract_id;`;
        const delete_bank_details_query = `UPDATE employee_bank_details SET active = 'N' WHERE bank_details_id = :bank_details_id;`;
        const delete_employee_query = `UPDATE employees SET active = 'N' WHERE employee_id = :employee_id;`;

        if (contract_id) {
          await employeesSequelize.query(delete_contract_query, {
            replacements: { contract_id },
            type: employeesSequelize.QueryTypes.UPDATE,
          });
        }
        if (bank_details_id) {
          await employeesSequelize.query(delete_bank_details_query, {
            replacements: { bank_details_id },
            type: employeesSequelize.QueryTypes.UPDATE,
          });
        }
        await employeesSequelize.query(delete_employee_query, {
          replacements: { employee_id },
          type: employeesSequelize.QueryTypes.UPDATE,
        });

        return res.status(200).json({
          success: true,
          data: [],
          message: "Employee deleted successfully!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Employee not found or inactive",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async getAllActiveEmployeesNames(req, res, next) {
    try {
      const get_all_active_employees_names_query = `SELECT employee_id, employee_name, employee_lastname
                                                      FROM employees 
                                                      WHERE active='Y' 
                                                      ORDER BY by employee_id asc`;

      const get_all_active_employees_names_data = await employeesSequelize.query(
        get_all_active_employees_names_query,
        {
          type: employeesSequelize.QueryTypes.SELECT,
        })
      if( get_all_active_employees_names_data &&  get_all_active_employees_names_data.length !== 0) {
         res.status(200).json({
          success: true,
          data: get_all_active_employees_names_data,
          message: "Retrieved successfully",
        });
      }
      else {
          res.json({
            success: false,
            data: [],
            message: "No active employees found",
          });}
          
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = employeesDao;
