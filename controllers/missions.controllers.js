const missionsDao = require("../dao/missions.dao");

const missions_instance = new missionsDao();

module.exports = {
  getAllActiveMissions: function (req, res, next) {
    missions_instance.getAllActiveMissions(req, res, next);
  },
};
