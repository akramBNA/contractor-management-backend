const { add } = require("date-fns");
const { missions } = require("../models/missions.models");

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
          success: true,
          data: missionsData,
          message: "Missions retrieved successfully",
        });
      } else {
        res.status(200).json({
          success: false,
          data: [],
          message: "No active missions found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async AddMission(req, res, next) {
    try {
      const { mission_name, mission_description, start_at, end_at, priority, expenses } = req.body;

      const add_mission_query = ` INSERT INTO missions ( mission_name, mission_description, start_at, end_at, priority, expenses, active ) VALUES ( ?, ?, ?, ?, ?, ?, 'Y' ) RETURNING *;`;

      const values = [
        mission_name,
        mission_description,
        start_at,
        end_at,
        priority || "LOW",
        expenses || 0,
      ];

      const [add_missions_data] = await missions.sequelize.query(
        add_mission_query,
        {
          replacements: values,
          type: missions.sequelize.QueryTypes.INSERT,
        }
      );

      if (add_missions_data && add_missions_data.length > 0) {
        res.status(200).json({
          success: true,
          data: add_missions_data[0],
          message: "Mission added successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Failed to add mission",
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async getMissionById(req, res, next) {
    try {
      const { mission_id } = req.params;

      const query = `SELECT *  FROM missions  WHERE mission_id = ? AND active = 'Y'`;

      const [missionData] = await missions.sequelize.query(query, {
        replacements: [mission_id],
        type: missions.sequelize.QueryTypes.SELECT,
      });

      if (missionData) {
        res.status(200).json({
          success: true,
          data: missionData,
          message: "Mission retrieved successfully",
        });
      } else {
        res.json({
          success: false,
          data: [],
          message: "Mission not found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = missionsDao;
