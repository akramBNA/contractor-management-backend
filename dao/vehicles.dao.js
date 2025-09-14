const { ca, da } = require("date-fns/locale");
const { vehicles } = require("../models/vehicles.models");

class vehiclesDao {
  async getAllVehicles(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const limit = params.limit ? parseInt(params.limit) : 20;
      const offset = params.offset ? parseInt(params.offset) : 0;
      const keyword = params.keyword ? params.keyword.trim() : "";

      let searchCondition = "";
      const replacements = { limit, offset };

      if (keyword) {
        searchCondition = ` AND (vehicles.brand ILIKE :keyword OR vehicles.model ILIKE :keyword OR vehicles.licence_plate ILIKE :keyword OR vehicles.vin_number ILIKE :keyword)`;
        replacements.keyword = `${keyword}%`;
      }

      const get_all_vehicles_count_query = `SELECT COUNT(*) AS total FROM vehicles WHERE active = 'Y' ${searchCondition}`;
      const get_all_vehicles_count_data = await vehicles.sequelize.query(get_all_vehicles_count_query,
        { replacements, type: vehicles.sequelize.QueryTypes.SELECT }
      );

      const total = parseInt(get_all_vehicles_count_data[0].total);

      if (total === 0) {
        return res.json({
          success: false,
          data: [],
          message: "No vehicles found",
        });
      }

      const get_all_vehicles_query = `SELECT * FROM vehicles 
                                      LEFT JOIN vehicle_types
                                      ON vehicles.vehicle_type_id = vehicle_types.vehicle_type_id                                
                                      WHERE vehicles.active = 'Y' AND vehicle_types.active = 'Y' ${searchCondition} 
                                      ORDER BY vehicle_id ASC 
                                      LIMIT :limit OFFSET :offset`;
      const get_all_vehicles_data = await vehicles.sequelize.query(
        get_all_vehicles_query,
        {
          replacements,
          type: vehicles.sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json({
        success: true,
        data: get_all_vehicles_data,
        attributes: { total, limit, offset },
        message: "Vehicles retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

  async addVehicle(req, res, next) {
    try {
      const {
        vehicle_type_id,
        brand,
        model,
        model_year,
        licence_plate,
        circulation_date,
        vin_number,
        insurance_number,
      } = req.body;

      const newVehicle = await vehicles.create({
        vehicle_type_id,
        brand,
        model,
        model_year,
        licence_plate,
        circulation_date,
        vin_number,
        insurance_number
      });

      if (!newVehicle || !newVehicle.vehicle_id) {
        return res.status(500).json({
          success: false,
          data: [],
          message: "Failed to add vehicle",
        });
      }

      res.status(201).json({
        success: true,
        data: newVehicle,
        message: "Vehicle added successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = vehiclesDao;
