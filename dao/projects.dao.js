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

      const countQuery = `SELECT * FROM projects ${whereClause}`;

      const countResult = await projects.sequelize.query(countQuery, {
        replacements: {
          likeKeyword: `${keyword}%`
        },
        type: projects.sequelize.QueryTypes.SELECT,
      });

      const totalCount = parseInt(countResult.length);

      if (totalCount === 0) {
        return res.json({
          success: true,
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

      countResult.forEach((project) => {
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

      const get_project_by_id_query = `SELECT * FROM projects WHERE project_id = :project_id AND active = 'Y'`;

      const result = await projects.sequelize.query(get_project_by_id_query, {
        replacements: { project_id },
        type: projects.sequelize.QueryTypes.SELECT,
      });

      console.log("---- result: ", result);
      
      if (result.length > 0) {

        res.status(200).json({
          success: true,
          data: result[0],
          message: "Project retrieved successfully",
        });
      } else {
        return res.json({
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
