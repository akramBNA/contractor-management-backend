const { projects } = require("../models/projects.models");
const { sequelize } = require("../database/database.js");


class projectsDao {
  async getAllProjects(req, res, next) {
    try {
      const get_all_projects_query = `SELECT * FROM projects WHERE active='Y' ORDER BY project_id ASC`; 
      const get_all_projects_data = await projects.sequelize.query(
        get_all_projects_query,
        {
          type: projects.sequelize.QueryTypes.SELECT,
        }
      );
      
      if (get_all_projects_data) {
        res.status(200).json({
          status: true,
          data: get_all_projects_data,
          message: "Retrieved successfully",
        });
      } else {
        res.json({
          status: false,
          data: [],
          message: "Failed to retrieve data",
        });
      }
    } catch (error) {
      return next(error);
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
      duration,
      priority,
      status,
    } = req.body;

    const newProject = await projects.create({
      project_name,
      description,
      assigned_to,
      start_date,
      end_date,
      duration,
      priority,
      status,
      active: 'Y'
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
