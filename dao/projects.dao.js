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

}

module.exports = projectsDao;
