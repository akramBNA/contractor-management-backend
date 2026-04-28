const company_configs = require("../models/company_configs.models");

class company_configsDao {
  async getCompanyConfigs(req, res, next) {
    try {
      const get_conpany_configs_query = `SELECT * FROM company_configs WHERE active='Y'`;

      const get_conpany_configs_data = await company_configs.sequelize.query(
        get_conpany_configs_query,
        {
          type: company_configs.sequelize.QueryTypes.SELECT,
        },
      );

      if (get_conpany_configs_data) {
        res.status(200).json({
          success: true,
          data: get_conpany_configs_data,
          message: "Data retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async addCompanyConfigs(req, res, next) {
    try {
      const { company_id, payroll_cycle_start_day, leave_accrual_rate } =
        req.body;

      const add_company_configs_query = `INSERT INTO company_configs (company_id, payroll_cycle_start_day, leave_accrual_rate) VALUES (${company_id}, ${payroll_cycle_start_day}, ${leave_accrual_rate})`;

      const add_company_configs_data = await company_configs.sequelize.query(
        add_company_configs_query,
        {
          type: company_configs.sequelize.QueryTypes.INSERT,
        },
      );

      if (add_company_configs_data) {
        res.status(200).json({
          success: true,
          data: add_company_configs_data,
          message: "Data added successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Failed to add data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async updateCompanyConfigs(req, res, next) {
    try {
      const {
        company_config_id,
        company_id,
        payroll_cycle_start_day,
        leave_accrual_rate,
      } = req.body;

      const update_company_configs_query = `UPDATE company_configs SET company_id=${company_id}, payroll_cycle_start_day=${payroll_cycle_start_day}, leave_accrual_rate=${leave_accrual_rate} WHERE company_config_id=${company_config_id}`;

      const update_company_configs_data = await company_configs.sequelize.query(
        update_company_configs_query,
        {
          type: company_configs.sequelize.QueryTypes.UPDATE,
        },
      );

      if (update_company_configs_data) {
        res.status(200).json({
          success: true,
          data: update_company_configs_data,
          message: "Data updated successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Failed to update data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async deleteCompanyConfigs(req, res, next) {
    try {
      const { company_config_id } = req.body;

      if (!company_config_id) {
        return res.json({
          success: false,
          data: [],
          message: "Company Config ID must be provided",
        });
      }

      const [updated] = await company_configs.update(
        { active: "N" },
        {
          where: { company_config_id: company_config_id },
        },
      );

      if (updated) {
        res.status(200).json({
          success: true,
          data: [],
          message: "Company Config deleted successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Company Config not found",
        });
      }
    } catch (error) {
      console.error("Error deleting company config:", error);
      return next(error);
    }
  }
}

module.exports = company_configsDao;
