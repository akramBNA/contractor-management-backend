const { add } = require("date-fns");
const { missions } = require("../models/missions.models");
const { mission_employees } = require("../models/mission_employees.models");

class missionsDao {
  async getAllActiveMissions(req, res, next) {
    try {

      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const keyWord = params.keyWord || "";
      const limit = parseInt(params.limit) || 20;
      const offset = parseInt(params.offset) || 0;

      const total_missions_query = `SELECT COUNT(*) AS total FROM missions WHERE active='Y'`;
      const total_missions_data = await missions.sequelize.query(
        total_missions_query,
        { type: missions.sequelize.QueryTypes.SELECT }
      );

      if(!total_missions_data || total_missions_data.length === 0) {
        res.json({
          success: false,
          message: "No active missions found",
        });
      }
      
      const get_all_active_missions_query = `
        SELECT * 
        FROM missions 
        WHERE active = 'Y' AND mission_name ILIKE '${keyWord}%'
        ORDER BY mission_id ASC 
        LIMIT ${limit}
        OFFSET ${offset} `;

      const get_all_active_missions_data = await missions.sequelize.query(get_all_active_missions_query, {
        type: missions.sequelize.QueryTypes.SELECT,
      });

      const get_all_running_missions_query = `SELECT COUNT(*) FROM missions WHERE end_at > CURRENT_DATE`;
      const get_all_running_missions_data = await missions.sequelize.query(get_all_running_missions_query, {
        type: missions.sequelize.QueryTypes.SELECT,
      });

      const get_all_completed_missions_query = `SELECT COUNT(*) FROM missions WHERE end_at <= CURRENT_DATE`;
      const get_all_completed_missions_data = await missions.sequelize.query(get_all_completed_missions_query, {
        type: missions.sequelize.QueryTypes.SELECT,
      });

      if (get_all_active_missions_data && get_all_active_missions_data.length > 0) {
        res.status(200).json({
          success: true,
          data: get_all_active_missions_data,
          running_missions: parseInt(get_all_running_missions_data[0].count),
          completed_missions: parseInt(get_all_completed_missions_data[0].count),
          attributes: {
            total: parseInt(total_missions_data[0].total),
            limit: limit,
            offset: offset, 
            pages: Math.ceil(total_missions_data[0].total / limit),
          },
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

    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.json({
        success: false,
        message: "Invalid start or end date format",
      });
    }

    if (startDate > endDate) {
      return res.json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

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
      return res.json({
        success: false,
        data: [],
        message: "Failed to add mission",
      });
    }

    if (!Array.isArray(employee_id) || employee_id.length === 0) {
      return res.json({
        success: false,
        data: [],
        message: "No employees provided for assignment",
      });
    }

    const insertValues = employee_id.map(empId => `(${insertedMission.mission_id}, ${empId})`).join(",");
    const assign_employees_to_mission_query = `INSERT INTO mission_employees (mission_id, employee_id) VALUES ${insertValues}`;

    await mission_employees.sequelize.query(assign_employees_to_mission_query, {
      type: mission_employees.sequelize.QueryTypes.INSERT,
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
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'employee_id', e.employee_id,
                'employee_name', e.employee_name,
                'employee_lastname', e.employee_lastname
              )
            ) FILTER (WHERE e.employee_id IS NOT NULL),
            '[]'
          ) AS assigned_employees
        FROM missions m
        LEFT JOIN mission_employees me 
          ON m.mission_id = me.mission_id AND me.active = 'Y'
        LEFT JOIN employees e 
          ON me.employee_id = e.employee_id
        WHERE m.mission_id = :missionId
          AND m.active = 'Y'
        GROUP BY m.mission_id`;

    const result = await missions.sequelize.query(query, {
      replacements: { missionId: mission_id },
      type: missions.sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      res.json({
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

async editMission(req, res, next) {
    try {
      const { mission_id } = req.params;
      const {
        mission_name,
        mission_description,
        start_at,
        end_at,
        priority,
        expenses,
        employee_id,
      } = req.body;

      const delete_mission_employees_query = `delete from mission_employees where active='Y' and mission_id = ${mission_id}`;
      const delete_mission_employees_data = await missions.sequelize.query(delete_mission_employees_query, {
        type: missions.sequelize.QueryTypes.DELETE,
      });
      
      if( !delete_mission_employees_data) {
        return res.json({
          success: false,
          data: [],
          message: "Mission not found or already inactive",
        });
      }

      const startDate = new Date(start_at);
      const endDate = new Date(end_at);

      if (isNaN(startDate) || isNaN(endDate)) {
        return res.json({
          success: false,
          message: "Invalid start or end date format",
        });
      }

      if (startDate > endDate) {
        return res.json({
          success: false,
          message: "Start date cannot be after end date",
        });
      }

        const update_mission_query = `UPDATE missions 
                                        SET 
                                          mission_name = ?, 
                                          mission_description = ?, 
                                          start_at = ?, 
                                          end_at = ?, 
                                          priority = ?, 
                                          expenses = ?
                                      WHERE mission_id = ? AND active = 'Y'
                                      RETURNING * `;

      const values = [
        mission_name,
        mission_description,
        start_at,
        end_at,
        priority || "LOW",
        expenses || 0,
        mission_id
      ];

      const update_mission_data = await missions.sequelize.query(update_mission_query, {
        replacements: values,
        type: missions.sequelize.QueryTypes.UPDATE,
      });

      if(update_mission_data[0].length === 0) {
        return res.json({
          success: false,
          data: [],
          message: "Mission not found or already inactive",
        });
      }


      if (!Array.isArray(employee_id) || employee_id.length === 0) {
        return res.json({
          success: false,
          data: [],
          message: "No employees provided for assignment",
        });
      }

      const insertValues = employee_id.map(empId => `(${mission_id}, ${empId})`).join(",");
      const assign_employees_to_mission_query = `INSERT INTO mission_employees (mission_id, employee_id) VALUES ${insertValues}`;

      const assign_employees_to_mission_data = await mission_employees.sequelize.query(assign_employees_to_mission_query, {
        type: mission_employees.sequelize.QueryTypes.INSERT,
      });

      if(assign_employees_to_mission_data[1] === 0) {
        return res.json({
          success: false,
          data: [],
          message: "Failed to assign employees to mission",
        });
      }

      res.status(200).json({
        success: true,
        data: update_mission_data[0][0],
        message: "Mission and employees updated successfully",
      });

    } catch (error) {
      return next(error);
    }
  }

}

module.exports = missionsDao;
