const vehiclesDao = require("../dao/vehicles.dao.js");
const vehicle_instance = new vehiclesDao();

module.exports = {
  getAllVehicles: function (req, res, next) {
    vehicle_instance.getAllVehicles(req, res, next);
  },
  addVehicle: function (req, res, next) {
    vehicle_instance.addVehicle(req, res, next);
  },
  updateVehicle: function (req, res, next) {
    vehicle_instance.updateVehicle(req, res, next);
  },
  deleteVehicle: function (req, res, next) {
    vehicle_instance.deleteVehicle(req, res, next);
  },
};
