const vehicle_typesDao = require("../dao/vehicle_types.dao");
const vehicle_types_instance = new vehicle_typesDao();

module.exports = {
  getAllVehicleTypes: function (req, res, next) {
    vehicle_types_instance.getAllVehicleTypes(req, res, next);
  }
};
