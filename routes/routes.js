const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");
const employees_controller = require("../controllers/employees.controlers");
const contracts_controlers = require("../controllers/contracts.controlers");
const contract_types_controller = require("../controllers/contract_types.controllers");
const employee_bank_details_controller = require("../controllers/employee_bank_details.controllers");
const jobs_controller = require("../controllers/jobs.controllers");
const projects_controller = require("../controllers/projects.controllers");
const tasks_controller = require("../controllers/tasks.controllers");
const company_controller = require("../controllers/company.controllers");


// USERS ROUTES.
router.get("/users/getAllUsers/", users_controller.getAllUsers);
router.post("/users/addUser/", users_controller.addUser);
router.post("/users/UserLogin/", users_controller.UserLogin);

// ROLES ROUTES
router.get("/roles/getAllRoles/", roles_controller.getAllRoles);

// EMPLOYEES ROUTES
router.get("/employees/getAllEmployees/", employees_controller.getAllEmployees);
router.get("/employees/getEmployeeById/:id", employees_controller.getEmployeeById);
router.post("/employees/addOneEmployee/", employees_controller.addOneEmployee);
router.get("/employees/getEmployeeById/:id", employees_controller.getEmployeeById);
router.get("/employees/getJobsAndContractTypes/", employees_controller.getJobsAndContractTypes);
router.put("/employees/editEmployee/:id", employees_controller.editEmployee);
router.delete("/employees/deleteEmployee/:id", employees_controller.deleteEmployee);

// CONTRACTS ROUTES
router.get("/contracts/getAllContracts/", contracts_controlers.getAllContracts);

// CONTRACT TYPES ROUTES
router.get("/contract_types/getAllContractTypes/", contract_types_controller.getAllContractTypes);

// EMPLOYEE BANK DETAILS ROUTES
router.get("/employee_bank_details/getAllEmployeeBankDetails/", employee_bank_details_controller.getAllEmployeeBankDetails);

// JOBS ROUTES
router.get("/jobs/getAllJobs/", jobs_controller.getAllJobs);

// PROJECTS ROUTES
router.get("/projects/getAllProjects/", projects_controller.getAllProjects);
router.post("/projects/addProject/", projects_controller.addProject);
router.get("/projects/getProjectById/:project_id", projects_controller.getProjectById);

// TASKS ROUTES
router.post("/tasks/getAllTasks/:project_id", tasks_controller.addTask);


module.exports = router;
