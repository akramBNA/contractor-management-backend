const billing_items = require("../models/billing_items.models.js");

class billing_itemsDao {
  async getAllBillingItems(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const keyword = params.keyword ? `${params.keyword}%` : "%";

      const get_all_billing_items_query =
        "SELECT * FROM billing_items WHERE active='Y' AND billing_item_name ILIKE :keyword ORDER BY billing_item_id ASC LIMIT :limit OFFSET :offset";
      const get_all_billing_items_data = await billing_items.sequelize.query(
        get_all_billing_items_query,
        {
          type: billing_items.sequelize.QueryTypes.SELECT,
          replacements: { keyword, limit, offset },
        },
      );
      if (get_all_billing_items_data) {
        res.status(200).json({
          success: true,
          Data: get_all_billing_items_data,
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

  async getBillingItemsByBillingId(req, res, next) {
    try {
      const billing_id = req.params.billing_id;

      const get_billing_items_by_billing_id_query =
        "SELECT * FROM billing_items WHERE active='Y' AND billing_id = :billing_id ORDER BY billing_item_id ASC";
      const get_billing_items_by_billing_id_data =
        await billing_items.sequelize.query(
          get_billing_items_by_billing_id_query,
          {
            type: billing_items.sequelize.QueryTypes.SELECT,
            replacements: { billing_id },
          },
        );
      if (get_billing_items_by_billing_id_data) {
        res.status(200).json({
          success: true,
          Data: get_billing_items_by_billing_id_data,
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

module.exports = billing_itemsDao;
