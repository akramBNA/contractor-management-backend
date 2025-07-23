const { tasks } = require("../models/tasks.models");
const { parseISO, isValid, isBefore, differenceInDays } = require("date-fns");

class tasksDao {
  async addTask(req, res, next) {
    try {
      let params = req.params.params;
      params = params && params.length ? JSON.parse(params) : {};      
      
      const project_id = params.project_id;

      const { task_name, description, start_date, end_date } = req.body;

      if ( !project_id || !task_name || !start_date || !end_date ) {
        return res.json({
          success: false,
          message: "Missing required fields: project_id, task_name, start_date, end_date"
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
