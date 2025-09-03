const projectsDao = require("../dao/projects.dao");

const projects_instance = new projectsDao();

module.exports = {
  getAllProjects: function (req, res, next) {
    projects_instance.getAllProjects(req, res, next);
  },
  addProject: function (req, res, next) {
    projects_instance.addProject(req, res, next);
  },
  getProjectById: function (req, res, next) {
    projects_instance.getProjectById(req, res, next);
  },
  deleteProject: function (req, res, next) {
    projects_instance.deleteProject(req, res, next);
  },
};