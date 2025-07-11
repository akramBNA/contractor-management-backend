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

async addMission(req, res, next) {
  try {
    const {
      mission_name,
      mission_description,
      start_at,
      end_at,
      priority,
      expenses,
      employee_id,
    } = req.body;

    const add_mission_query = `
      INSERT INTO missions (mission_name, mission_description, start_at, end_at, priority, expenses)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *; `;

    const values = [
      mission_name,
      mission_description,
      start_at,
      end_at,
      priority || "LOW",
      expenses || 0,
    ];

    const add_missions_data = await missions.sequelize.query(add_mission_query, {
      replacements: values,
      type: missions.sequelize.QueryTypes.INSERT,
    });

    const insertedMission = add_missions_data[0][0];

    if (!insertedMission) {
      res.json({
        success: false,
        data: [],
        message: "Failed to add mission",
      });
    }

    if (!Array.isArray(employee_id) || employee_id.length === 0) {
      res.json({
        success: false,
        data: [],
        message: "No employees provided for assignment",
      });
    }

    const insertValues = employee_id.map(empId => `(${insertedMission.mission_id}, ${empId})`).join(",");
    const assign_query = `INSERT INTO mission_employees (mission_id, employee_id) VALUES ${insertValues}`;

    await missions.sequelize.query(assign_query, {
      type: missions.sequelize.QueryTypes.INSERT,
    });

    res.status(200).json({
      success: true,
      data: insertedMission,
      message: "Mission and employees assigned successfully",
    });
  } catch (error) {
    return next(error);
  }
  }

async getMissionById(req, res, next) {
  try {
    const { mission_id } = req.params;

    const query = `
      SELECT 
        m.mission_id,
        m.mission_name,
        m.mission_description,
        m.start_at,
        m.end_at,
        m.priority,
        m.expenses,
        json_agg(
          json_build_object(
            'employee_id', e.employee_id,
            'employee_name', e.employee_name,
            'employee_lastname', e.employee_lastname
          )
        ) AS assigned_employees
      FROM missions m
      JOIN mission_employees me 
        ON m.mission_id = me.mission_id
      JOIN employees e 
        ON me.employee_id = e.employee_id
      WHERE m.mission_id = :missionId
        AND m.active = 'Y'
        AND me.active = 'Y'
      GROUP BY m.mission_id;
    `;

    const result = await missions.sequelize.query(query, {
      replacements: { missionId: mission_id },
      type: missions.sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    return next(error);
  }
  }

}

module.exports = missionsDao;
