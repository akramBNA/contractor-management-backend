const { add } = require("date-fns");
const missionsDao = require("../dao/missions.dao");

const missions_instance = new missionsDao();

module.exports = {
  getAllActiveMissions: function (req, res, next) {
    missions_instance.getAllActiveMissions(req, res, next);
  },
  addMission: function (req, res, next) {
    missions_instance.AddMission(req, res, next);
  },
  getMissionById: function (req, res, next) {
    missions_instance.getMissionById(req, res, next);
  },
};
