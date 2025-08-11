const express = require("express");
const router = express.Router();
// const net = require('net');


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
const missions_controller = require("../controllers/missions.controllers");
const mission_employees_controller = require("../controllers/mission_employees.controllers");
const salaries_controller = require("../controllers/salaries.controllers");
const project_employees_controller = require("../controllers/project_employees.controllers");
const leaves_controller = require("../controllers/leaves.controllers");
const leave_types_controller = require("../controllers/leave_types.controllers");
const holidays_controller = require("../controllers/holidays.controllers");


// USERS ROUTES.
router.get("/users/getAllUsers/:params", users_controller.getAllUsers);
router.post("/users/addUser/", users_controller.addUser);
router.post("/users/UserLogin/", users_controller.UserLogin);
router.get("/users/getUserDataByIdAfterLogin/:id", users_controller.getUserDataByIdAfterLogin);
router.get("/users/getUserById/:id", users_controller.getUserById);
router.put("/users/updateUser/:id", users_controller.updateUser);
router.delete("/users/deleteUser/:id", users_controller.deleteUser);
router.post("/users/signupWithEmployeeEmail/", users_controller.signupWithEmployeeEmail);
router.put("/users/updateUserRole/:params", users_controller.updateUserRole);

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
router.get("/employees/getAllActiveEmployeesNames/", employees_controller.getAllActiveEmployeesNames);

// CONTRACTS ROUTES
router.get("/contracts/getAllContracts/", contracts_controlers.getAllContracts);

// CONTRACT TYPES ROUTES
router.get("/contract_types/getAllContractTypes/", contract_types_controller.getAllContractTypes);

// EMPLOYEE BANK DETAILS ROUTES
router.get("/employee_bank_details/getAllEmployeeBankDetails/", employee_bank_details_controller.getAllEmployeeBankDetails);

// JOBS ROUTES
router.get("/jobs/getAllJobs/", jobs_controller.getAllJobs);

// PROJECTS ROUTES
router.get("/projects/getAllProjects/:params", projects_controller.getAllProjects);
router.post("/projects/addProject/", projects_controller.addProject);
router.get("/projects/getProjectById/:params", projects_controller.getProjectById);
router.delete("/projects/deleteProject/:params", projects_controller.deleteProject);

// TASKS ROUTES
router.post("/tasks/addTask/:params", tasks_controller.addTask);

// MISSIONS ROUTES
router.get("/missions/getAllMissions/:params", missions_controller.getAllActiveMissions);
router.post("/missions/addMission/", missions_controller.addMission);
router.get("/missions/getMissionById/:mission_id", missions_controller.getMissionById);
router.put("/missions/editMission/:mission_id", missions_controller.editMission);
router.delete("/missions/deleteMission/:mission_id", missions_controller.deleteMission);

// MISSION EMPLOYEES ROUTES
router.get("/mission_employees/getAllAssignedEmployees/", mission_employees_controller.getAllAssignedEmployees);

// SALARIES ROUTES
router.get("/salaries/getAllSalaries/:params", salaries_controller.getAllSalaries);

// PROJECT EMPLOYEES ROUTES

// LEAVES ROUTES
router.get("/leaves/getAllLeaves/:params", leaves_controller.getAllLeaves);
router.get("/leaves/getAllLeavesById/:params", leaves_controller.getAllLeavesById);
router.post("/leaves/requestLeave/", leaves_controller.requestLeave);
router.put("/leaves/acceptLeaves/:params", leaves_controller.acceptLeaves);
router.put("/leaves/rejectLeaves/:params", leaves_controller.rejectLeaves);
router.put("/leaves/deleteLeaves/:params", leaves_controller.deleteLeaves);

// LEAVE TYPES ROUTES
router.get("/leave_types/getAllLeaveTypes/", leave_types_controller.getAllLeaveTypes);
router.post("/leave_types/addLeaveType/", leave_types_controller.addLeaveType);

// HOLIDAYS ROUTES
router.get("/holidays/getAllHolidaysByYear/:params", holidays_controller.getAllHolidaysByYear);
router.post("/holidays/addHoliday/", holidays_controller.addHoliday);

// router.get('/test-ipv6-tcp', (req, res) => {
//   const host = process.env.DB_HOST || 'db.dwljrqocfqirbgrulxck.supabase.co';
//   const port = process.env.DB_PORT || 5432;

//   const socket = new net.Socket();
//   socket.setTimeout(5000);

//   socket.on('connect', () => {
//     socket.destroy();
//     res.json({ success: true, message: `TCP connection to ${host}:${port} succeeded` });
//   });

//   socket.on('error', (err) => {
//     socket.destroy();
//     res.status(500).json({ success: false, message: 'TCP connection failed', error: err.message });
//   });

//   socket.on('timeout', () => {
//     socket.destroy();
//     res.status(500).json({ success: false, message: 'TCP connection timed out' });
//   });

//   socket.connect(port, host);
// });


module.exports = router;
