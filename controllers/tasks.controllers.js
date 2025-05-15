const tasksDao = require("../dao/tasks.dao");

const projects_instance = new tasksDao();

module.exports = {
    addTask: function (req, res, next) {
        projects_instance.addTask(req, res, next);
    },
};