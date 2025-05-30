const { missions } = require("../models/missions.model");

class missionsDao {
  async getAllActiveMissions(req, res, next) {
    try {
      const query = `
        SELECT * 
        FROM missions 
        WHERE active = 'Y' 
        ORDER BY mission_id ASC
      `;

      const missionsData = await missions.sequelize.query(query, {
        type: missions.sequelize.QueryTypes.SELECT,
      });

      if (missionsData && missionsData.length > 0) {
        res.status(200).json({
          status: true,
          data: missionsData,
          message: "Missions retrieved successfully",
        });
      } else {
        res.status(200).json({
          status: false,
          data: [],
          message: "No active missions found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = missionsDao;
