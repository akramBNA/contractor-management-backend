const { tasks } = require("../models/tasks.models");
const { projects } = require("../models/projects.models");
const { parseISO, isValid, isAfter, isBefore, differenceInDays, startOfDay, endOfDay } = require('date-fns');

class tasksDao {
  async addTask(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};

      const project_id = params.project_id;
      const { task_name, description, start_date, end_date } = req.body;

      if (!project_id || !task_name || !start_date || !end_date) {
        return res.json({
          success: false,
          message: "Missing required fields: project_id, task_name, start_date, end_date"
        });
      }

      let start = parseISO(start_date);
      let end = parseISO(end_date);

      if (!isValid(start) || !isValid(end)) {
        return res.json({
          success: false,
          message: "Invalid date format. Use 'YYYY-MM-DD'",
        });
      }

      start = startOfDay(start);
      end = startOfDay(end);

      if (isAfter(start, end)) {
        return res.json({
          success: false,
          message: "start_date must be before or equal to end_date",
        });
      }

      const project = await projects.findOne({ where: { project_id } });

      if (!project) {
        return res.json({
          success: false,
          message: "Project not found",
        });
      }

      const projectStart = startOfDay(new Date(project.start_date));
      const projectEnd = startOfDay(new Date(project.end_date));

      console.log("----- Project Start Date:", projectStart);
      console.log("----- Project End Date:", projectEnd);
      console.log("----- Task Start Date:", start);
      console.log("----- Task End Date:", end);

      if (isBefore(start, projectStart) || isAfter(end, projectEnd)) {
        return res.json({
          success: false,
          message: `Task dates must be within the project's date range: ${project.start_date} to ${project.end_date}`,
        });
      }

      const duration = differenceInDays(end, start) + 1;

      const newTask = await tasks.create({
        project_id,
        task_name,
        description,
        start_date,
        end_date,
        duration,
        active: "Y",
      });

      if (!newTask) {
        return res.json({
          success: false,
          message: "Failed to add task",
        });
      }

      res.status(200).json({
        success: true,
        data: newTask,
        message: "Task added successfully",
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = tasksDao;
