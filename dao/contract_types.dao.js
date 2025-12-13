const contract_types = require("../models/contract_types.models.js");

class contract_typesDao {
  async getAllContractTypes(req, res, next) {
    try {
      const get_all_contract_types_query = "SELECT * FROM contract_types WHERE active='Y' ORDER BY contract_type_id ASC";
      const get_all_contract_types_data = await contract_types.sequelize.query(
        get_all_contract_types_query,
        {
          type: contract_types.sequelize.QueryTypes.SELECT,
        }
      );
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
      const { contract_type_name, description } = req.body;

      const new_contract_type = await contract_types.create({
        contract_type_name,
        description,
        active: 'Y',
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
      const { id } = req.params;
      const { contract_type_name, description, active } = req.body;

      const contract_type_to_update = await contract_types.findByPk(id);
      if (!contract_type_to_update) {
        return res.json({
          success: false,
          data: [],
          message: "Contract type not found",
        });
      }

      contract_type_to_update.contract_type_name = contract_type_name;
      contract_type_to_update.description = description;
      contract_type_to_update.active = active;

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
}

module.exports = contract_typesDao;
