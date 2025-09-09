const  vehiclesDao = require("../dao/vehicles.dao.js");
const vehicle_instance = new vehiclesDao();

module.exports = {
  getAllVehicles: function (req, res, next) {
    vehicle_instance.getAllVehicles(req, res, next);
    },
};
