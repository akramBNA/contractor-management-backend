const { vehicle_types } = require("../models/vehicle_types.models");

class vehicle_typesDao {
  async getAllVehicleTypes(req, res, next) {
    try {
      const get_all_vehicle_types_query = `SELECT * FROM vehicle_types WHERE active = 'Y' ORDER BY vehicle_type_id ASC`;
      const get_all_vehicle_types_data = await vehicle_types.sequelize.query(get_all_vehicle_types_query,
        {
          type: vehicle_types.sequelize.QueryTypes.SELECT,
        }
      );

      if (
        !get_all_vehicle_types_data ||
        get_all_vehicle_types_data.length === 0
      ) {
        return res.status(200).json({
          success: false,
          data: [],
          message: "No vehicle types found!",
        });
      }

      return res.status(200).json({
        success: true,
        data: get_all_vehicle_types_data,
        message: "Vehicle types retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = vehicle_typesDao;
