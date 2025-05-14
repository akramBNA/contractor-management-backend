const contracts = require("../models/contracts.models.js");

class contractsDao {
  async getAllContracts(req, res, next) {
    try {
      const get_all_contracts_query = "SELECT * FROM contracts ORDER BY contract_id ASC";
      const get_all_contracts_data = await contracts.sequelize.query(
        get_all_contracts_query,
        {
          type: contracts.sequelize.QueryTypes.SELECT,
        }
      );
      if (get_all_contracts_data) {
        res.status(200).json({
          success: true,
          Data: get_all_contracts_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          Data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = contractsDao;
