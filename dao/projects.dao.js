const { projects } = require("../models/projects.models");
const {tasks} = require("../models/tasks.models.js")
const { sequelize } = require("../database/database.js");
const { differenceInDays, parseISO, isValid, isBefore } = require("date-fns");
const { project_employees } = require("../models/project_employees.models.js");

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
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const project_id = params.project_id;

      const get_project_by_id_query = `SELECT 
                                        pr.project_id,
                                        pr.project_name,
                                        pr.description,
                                        pr.start_date,
                                        pr.end_date,
                                        pr.duration,
                                        pr.priority,
                                        pr.status,
                                        COALESCE(
                                          json_agg(
                                            DISTINCT jsonb_build_object(
                                              'employee_id', e.employee_id,
                                              'employee_name', e.employee_name,
                                              'employee_lastname', e.employee_lastname
                                            )
                                          ) FILTER (WHERE pe.active = 'Y' AND e.employee_id IS NOT NULL), '[]' ) AS assigned_employees
                                      FROM projects pr
                                      LEFT JOIN project_employees pe 
                                        ON pr.project_id = pe.project_id
                                      LEFT JOIN employees e 
                                        ON pe.employee_id = e.employee_id
                                      WHERE pr.project_id = :project_id
                                      GROUP BY pr.project_id;`;

      const result = await projects.sequelize.query(get_project_by_id_query, {
        replacements: { project_id },
        type: projects.sequelize.QueryTypes.SELECT,
      });

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
        employee_id
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

      if (!Array.isArray(employee_id) || employee_id.length === 0) {
        return res.json({
          success: false,
          message: "No employees provided for assignment",
        });
      }

      const insertValues = employee_id.map(empId => `(${newProject.project_id}, ${empId})`).join(",");

      const assignEmployeesQuery = `INSERT INTO project_employees (project_id, employee_id) VALUES ${insertValues}`;

      await projects.sequelize.query(assignEmployeesQuery, {
        type: projects.sequelize.QueryTypes.INSERT,
      });

      res.status(200).json({
        success: true,
        data: newProject,
        message: "Project created and employees assigned successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next){
    try{

      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const project_id  = params.project_id;

      const find_tasks_query = await tasks.findAll({
        where:{project_id: project_id, active:'Y'}
      });

      const find_project_employees_query = await project_employees.findAll({
        where:{project_id: project_id, active:'Y'}
      });

      const find_project_query = await projects.findOne({
        where: { project_id: project_id }
      });

      if( find_project_query.active === 'N' ){
        return res.json({
          success: false,
          data: [],
          message: "Project not found or inactive"
        })
      }

      const [delete_tasks] = await tasks.update(
        { active: 'N' },
        { where: { project_id: project_id }, returning: false }
      );

      const [delete_project_employees] = await project_employees.update(
        { active: 'N' },
        { where: { project_id: project_id }, returning: false }
      );

      const [delete_project] = await projects.update(
        { active: 'N' },
        { where: { project_id: project_id }, returning: false }
      );

      res.status(200).json({
        success: true,
        data: [],
        message: 'project , project_employees and its assigned tasks deleted successfully',
      });

    }catch(error){
      return next(error);
    }
  }

}

module.exports = projectsDao;
