const { tasks } = require("../models/tasks.models");
const { parseISO, isValid, isBefore, differenceInDays } = require("date-fns");

class tasksDao {
  async addTask(req, res, next) {
    try {
      const { project_id } = req.params;
      const {
        task_name,
        description,
        assigned_to,
        start_date,
        end_date,
        priority,
        status,
      } = req.body;

      if (
        !project_id ||
        !task_name ||
        !start_date ||
        !end_date ||
        !priority ||
        !status
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: project_id, task_name, start_date, end_date, priority, status",
        });
      }

      const start = parseISO(start_date);
      const end = parseISO(end_date);

      if (!isValid(start) || !isValid(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use 'YYYY-MM-DD'",
        });
      }

      if (!isBefore(start, end) && start_date !== end_date) {
        return res.status(400).json({
          success: false,
          message: "start_date must be before or equal to end_date",
        });
      }

      const duration = differenceInDays(end, start) + 1;

      const newTask = await tasks.create({
        project_id,
        task_name,
        description,
        assigned_to,
        start_date,
        end_date,
        duration,
        priority,
        status,
        active: "Y",
      });

      if (!newTask) {
        return res.status(500).json({
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
