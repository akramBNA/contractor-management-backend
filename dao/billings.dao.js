const billings = require("../models/billings.models.js");

class billingsDao {
  async getAllBillings(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const keyword = params.keyword ? `${params.keyword}%` : "%";

      const get_all_billings_query =
        "SELECT * FROM billings WHERE active='Y' AND billing_name ILIKE :keyword ORDER BY billing_id ASC LIMIT :limit OFFSET :offset";
      const get_all_billings_data = await billings.sequelize.query(
        get_all_billings_query,
        {
          type: billings.sequelize.QueryTypes.SELECT,
          replacements: { keyword, limit, offset },
        },
      );
      if (get_all_billings_data) {
        res.status(200).json({
          success: true,
          Data: get_all_billings_data,
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

module.exports = billingsDao;
