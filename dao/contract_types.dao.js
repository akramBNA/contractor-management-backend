const {contract_types} = require("../models/contract_types.models.js");

class contract_typesDao {
  async getAllContractTypes(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const keyword = params.keyword ? `%${params.keyword}%` : '%%';
      
      console.log("*********************************** params: ", params);
      

      const get_all_contract_types_query = "SELECT * FROM contract_types WHERE active='Y' AND contract_name LIKE :keyword ORDER BY contract_type_id ASC LIMIT :limit OFFSET :offset";
      const get_all_contract_types_data = await contract_types.sequelize.query(
        get_all_contract_types_query,
        {
          replacements: { keyword, limit, offset },
          type: contract_types.sequelize.QueryTypes.SELECT,
        }
      );
      console.log("---------------------------------- contract types data: ", get_all_contract_types_data);
      
      if (get_all_contract_types_data && get_all_contract_types_data.length > 0) {
        res.status(200).json({
          success: true,
          data: get_all_contract_types_data,
          message: "Retrieved successfully",
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
  };

  async addContractType(req, res, next) {
    try {
      const { contract_name, leaves_credit } = req.body;

      const new_contract_type = await contract_types.create({
        contract_name,
        leaves_credit,
      });

      if (!new_contract_type || !new_contract_type.contract_type_id) {
        return res.json({
          success: false,
          data: [],
          message: "Failed to add contract type",
        });
      }

      res.status(201).json({
        success: true,
        data: new_contract_type,
        message: "Contract type added successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

  async updateContractType(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const contract_type_id = params.contract_type_id;
      const { contract_name, leaves_credit } = req.body;

      const contract_type_to_update = await contract_types.findByPk(contract_type_id);
      if (!contract_type_to_update) {
        return res.json({
          success: false,
          data: [],
          message: "Contract type not found",
        });
      }

      contract_type_to_update.contract_name = contract_name;
      contract_type_to_update.leaves_credit = leaves_credit;

      await contract_type_to_update.save();

      res.status(200).json({
        success: true,
        data: contract_type_to_update,
        message: "Contract type updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

  async deleteContractType(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const contract_type_id = params.contract_type_id;

      const contract_type_to_delete = await contract_types.findByPk(contract_type_id);
      if (!contract_type_to_delete) {
        return res.json({
          success: false,
          data: [],
          message: "Contract type not found",
        });
      }

      const delete_contract_type_query = `UPDATE contract_types SET active='N' WHERE contract_type_id = :contract_type_id`;

      const delete_contract_type_data = await contract_types.sequelize.query(delete_contract_type_query, {
        replacements: { contract_type_id: contract_type_id },
        type: contract_types.sequelize.QueryTypes.UPDATE,
      });

      if (!delete_contract_type_data) {
        return res.json({
          success: false,
          data: [],
          message: "Failed to delete contract type",
        });
      } 

      res.status(200).json({
        success: true,
        data: [],
        message: "Contract type deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

}

module.exports = contract_typesDao;
