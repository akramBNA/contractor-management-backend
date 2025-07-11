const { add } = require("date-fns");
const missionsDao = require("../dao/missions.dao");

const missions_instance = new missionsDao();

module.exports = {
  getAllActiveMissions: function (req, res, next) {
    missions_instance.getAllActiveMissions(req, res, next);
  },
  addMission: function (req, res, next) {
    missions_instance.addMission(req, res, next);
  },
  getMissionById: function (req, res, next) {
    missions_instance.getMissionById(req, res, next);
  },
  getMissionById_2: function (req, res, next) {
    missions_instance.getMissionById_2(req, res, next);
  }
};
