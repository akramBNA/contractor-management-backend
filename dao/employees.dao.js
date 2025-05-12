const {
  employees,
  sequelize: employeesSequelize,
} = require("../models/employees.models");
const {
  contracts,
  sequelize: contractsSequelize,
} = require("../models/contracts.models");
const {
  employee_bank_details,
  sequelize: bankDetailsSequelize,
} = require("../models/employee_bank_details.models");
const {
  contract_types,
  sequelize: contractTypesSequelize,
} = require("../models/contract_types.models");
const { Op, Sequelize } = require("sequelize");

class employeesDao {
  async getAllEmployees(req, res, next) {
    try {
      const { limit = 20, offset = 0, keyword = "" } = req.query;

      const activeCount = await employees.count({ where: { active: "Y" } });
      if (activeCount === 0) {
        return res.status(404).json({
          status: false,
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
          "employee_phone_number"
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
        status: true,
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

  async getEmployeeById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);

      const employee = await employees.findOne({
        where: {
          employee_id: id,
          active: "Y",
        },
      });

      if (!employee) {
        return res.status(404).json({
          status: false,
          data: null,
          message: "Employee not found or inactive",
        });
      }

      let contract = null;
      let contractType = null;
      if (employee.employee_contract_id) {
        contract = await contracts.findOne({
          where: {
            contract_id: employee.employee_contract_id,
            active: "Y",
          },
        });

        if (contract && contract.contract_type_id) {
          contractType = await contract_types.findOne({
            where: {
              contract_type_id: contract.contract_type_id,
              active: "Y",
            },
          });
        }
      }

      let bankDetails = null;
      if (employee.employee_bank_details_id) {
        bankDetails = await employee_bank_details.findOne({
          where: {
            bank_details_id: employee.employee_bank_details_id,
            active: "Y",
          },
        });
      }

      return res.status(200).json({
        status: true,
        data: {
          employee,
          contract,
          contractType,
          bankDetails,
        },
        message: "Employee data retrieved successfully",
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
        employee_matricule = null,
      } = req.body;

      await employeesSequelize.query(
        `INSERT INTO employees (
          employee_name, employee_lastname, employee_phone_number,
          employee_email, employee_address, employee_national_id,
          employee_image_id, employee_bank_details_id,
          employee_contract_id, employee_gender,
          employee_birth_date, employee_job_title,
          employee_joining_date, employee_matricule
        )
        VALUES (
          :employee_name, :employee_lastname, :employee_phone_number,
          :employee_email, :employee_address, :employee_national_id,
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
            employee_address,
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
      return res.status(201).json({
          status: true,
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
          status: false,
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
        status: true,
        data: employee_data_2,
        message: "Employee data retrieved successfully",
      });

    } catch (error) {
      return next(error);
    }
  }
}

module.exports = employeesDao;
