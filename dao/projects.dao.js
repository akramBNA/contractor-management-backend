const { projects } = require("../models/projects.models");
const { sequelize } = require("../database/database.js");
const { differenceInDays, parseISO, isValid, isBefore } = require("date-fns");

class projectsDao {
  async getAllProjects(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const keyword = params.keyword || "";
      const limit = parseInt(params.limit) || 20;
      const offset = parseInt(params.offset) || 0;

      const whereClause = `WHERE active = 'Y'` + (keyword ? ` AND project_name ILIKE :likeKeyword` : '');
      const countQuery = `SELECT COUNT(*) AS total FROM projects ${whereClause}`;

      const countResult = await projects.sequelize.query(countQuery, {
        replacements: {
          likeKeyword: `${keyword}%`
        },
        type: projects.sequelize.QueryTypes.SELECT,
      });

      const totalCount = parseInt(countResult[0].total);

      if (totalCount === 0) {
        return res.json({
          success: false,
          data: [],
          message: "No projects found matching the criteria.",
        });
      }

      const get_all_projects_query = `
        SELECT * FROM projects 
        ${whereClause}
        ORDER BY project_id ASC
        LIMIT :limit OFFSET :offset`;

      const get_all_projects_data = await projects.sequelize.query(get_all_projects_query, {
        replacements: {
          likeKeyword: `${keyword}%`,
          limit,
          offset,
        },
        type: projects.sequelize.QueryTypes.SELECT,
      });

      const projectStats = {
        notStarted: 0,
        inProgress: 0,
        finished: 0,
        canceled: 0,
      };

      get_all_projects_data.forEach((project) => {
        switch (project.status) {
          case "Not Started":
            projectStats.notStarted++;
            break;
          case "In Progress":
            projectStats.inProgress++;
            break;
          case "Finished":
            projectStats.finished++;
            break;
          case "Canceled":
            projectStats.canceled++;
            break;
        }
      });

      res.status(200).json({
        success: true,
        data: get_all_projects_data,
        attributes: {
          total: totalCount,
          limit: limit,
          offset: offset,
          pages: Math.ceil(totalCount / limit),
        },
        stats: projectStats,
        message: "Retrieved successfully",
      });

    } catch (error) {
      return next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { project_id } = req.params;

      const get_project_by_id_query = `
      SELECT 
        p.project_id AS project_id,
        p.project_name,
        p.description AS project_description,
        p.assigned_to AS project_assigned_to,
        p.priority AS project_priority,
        p.status AS project_status,
        p.start_date AS project_start,
        p.end_date AS project_end,
        p.duration AS project_duration,
        t.task_id AS task_id,
        t.task_name,
        t.description AS task_description,
        t.assigned_to AS task_assigned_to,
        t.priority AS task_priority,
        t.status AS task_status,
        t.start_date AS task_start,
        t.end_date AS task_end,
        t.duration AS task_duration
      FROM 
        projects p
      LEFT JOIN 
        tasks t ON t.project_id = p.project_id
      WHERE 
        p.project_id = :project_id AND p.active = 'Y'
      ORDER BY 
        t.start_date ASC`;

      const result = await projects.sequelize.query(get_project_by_id_query, {
        replacements: { project_id },
        type: projects.sequelize.QueryTypes.SELECT,
      });

      if (result.length > 0) {
        const project_data = {
          project_id: result[0].project_id,
          project_name: result[0].project_name,
          description: result[0].project_description,
          assigned_to: result[0].project_assigned_to,
          priority: result[0].project_priority,
          status: result[0].project_status,
          start_date: result[0].project_start,
          end_date: result[0].project_end,
          duration: result[0].project_duration,
          tasks: result
            .filter((row) => row.task_id !== null)
            .map((row) => ({
              task_id: row.task_id,
              task_name: row.task_name,
              description: row.task_description,
              assigned_to: row.task_assigned_to,
              priority: row.task_priority,
              status: row.task_status,
              start_date: row.task_start,
              end_date: row.task_end,
              duration: row.task_duration,
            })),
        };

        res.status(200).json({
          success: true,
          data: project_data,
          message: "Project retrieved successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async addProject(req, res, next) {
    try {
      const {
        project_name,
        description,
        assigned_to,
        start_date,
        end_date,
        priority,
        status,
      } = req.body;

      if (!project_name || !start_date || !end_date || !priority || !status) {
        return res.json({
          success: false,
          message:
            "Missing required fields: project_name, start_date, end_date, priority, status",
        });
      }

      const start = parseISO(start_date);
      const end = parseISO(end_date);

      if (!isValid(start) || !isValid(end)) {
        return res.json({
          success: false,
          message: "Invalid date format. Use 'YYYY-MM-DD'",
        });
      }

      if (!isBefore(start, end) && start_date !== end_date) {
        return res.json({
          success: false,
          message: "start_date must be before or equal to end_date",
        });
      }

      const duration = differenceInDays(end, start) + 1;

      const newProject = await projects.create({
        project_name,
        description,
        assigned_to,
        start_date,
        end_date,
        duration,
        priority,
        status,
        active: "Y",
      });

      res.status(200).json({
        success: true,
        data: newProject,
        message: "Project created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = projectsDao;
