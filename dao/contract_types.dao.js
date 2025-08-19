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
  }
}

module.exports = contract_typesDao;
