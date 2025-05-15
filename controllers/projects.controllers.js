const projectsDao = require("../dao/projects.dao");

const projects_instance = new projectsDao();

module.exports = {
  getAllProjects: function (req, res, next) {
    projects_instance.getAllProjects(req, res, next);
  },
};
