const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");
const employees_controller = require("../controllers/employees.controlers");

// USERS ROUTES.
router.get("/users/getAllUsers/", users_controller.getAllUsers);

// ROLES ROUTES
router.get("/roles/getAllRoles/", roles_controller.getAllRoles);

// EMPLOYEES ROUTES
router.get("/employees/getAllEmployees/", employees_controller.getAllemployees);

module.exports = router;
