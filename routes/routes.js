const express = require("express");
const router = express.Router();

const authenticateToken = require('../middlewares/authentication.middlewares');


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
const company_configs_controller = require('../controllers/company_configs.controllers');
const vehicles_controller = require("../controllers/vehicles.controllers");
const vehicle_types_controller = require("../controllers/vehicle_types.controllers");
const hr_stats_controller = require("../controllers/hr_stats.controllers");


// USERS ROUTES.
router.get("/users/getAllUsers/:params", authenticateToken, users_controller.getAllUsers);
router.post("/users/addUser/", authenticateToken, users_controller.addUser);
router.post("/users/UserLogin/", users_controller.UserLogin);
router.get("/users/getUserDataByIdAfterLogin/:id", authenticateToken, users_controller.getUserDataByIdAfterLogin);
router.get("/users/getUserById/:id", authenticateToken, users_controller.getUserById);
router.put("/users/updateUser/:id", authenticateToken, users_controller.updateUser);
router.delete("/users/deleteUser/:id", authenticateToken, users_controller.deleteUser);
router.post("/users/signupWithEmployeeEmail/", users_controller.signupWithEmployeeEmail);
router.put("/users/updateUserRole/:params", authenticateToken, users_controller.updateUserRole);

// ROLES ROUTES
router.get("/roles/getAllRoles/", authenticateToken, roles_controller.getAllRoles);

// EMPLOYEES ROUTES
router.get("/employees/getAllEmployees/", authenticateToken, employees_controller.getAllEmployees);
router.get("/employees/getEmployeeById/:id", authenticateToken, employees_controller.getEmployeeById);
router.post("/employees/addOneEmployee/", authenticateToken, employees_controller.addOneEmployee);
router.get("/employees/getEmployeeById/:id", authenticateToken, employees_controller.getEmployeeById);
router.get("/employees/getJobsAndContractTypes/", authenticateToken, employees_controller.getJobsAndContractTypes);
router.put("/employees/editEmployee/:id", authenticateToken, employees_controller.editEmployee);
router.delete("/employees/deleteEmployee/:id", authenticateToken, employees_controller.deleteEmployee);
router.get("/employees/getAllActiveEmployeesNames/", authenticateToken, employees_controller.getAllActiveEmployeesNames);

// CONTRACTS ROUTES
router.get("/contracts/getAllContracts/", authenticateToken, contracts_controlers.getAllContracts);

// CONTRACT TYPES ROUTES
router.get("/contract_types/getAllContractTypes/", authenticateToken, contract_types_controller.getAllContractTypes);

// EMPLOYEE BANK DETAILS ROUTES
router.get("/employee_bank_details/getAllEmployeeBankDetails/", authenticateToken, employee_bank_details_controller.getAllEmployeeBankDetails);

// JOBS ROUTES
router.get("/jobs/getAllJobs/", authenticateToken, jobs_controller.getAllJobs);

// PROJECTS ROUTES
router.get("/projects/getAllProjects/:params", authenticateToken, projects_controller.getAllProjects);
router.post("/projects/addProject/", authenticateToken, projects_controller.addProject);
router.get("/projects/getProjectById/:params", authenticateToken, projects_controller.getProjectById);
router.delete("/projects/deleteProject/:params", authenticateToken, projects_controller.deleteProject);

// TASKS ROUTES
router.post("/tasks/addTask/:params", authenticateToken, tasks_controller.addTask);

// MISSIONS ROUTES
router.get("/missions/getAllMissions/:params", authenticateToken, missions_controller.getAllActiveMissions);
router.post("/missions/addMission/", authenticateToken, missions_controller.addMission);
router.get("/missions/getMissionById/:mission_id", authenticateToken, missions_controller.getMissionById);
router.put("/missions/editMission/:mission_id", authenticateToken, missions_controller.editMission);
router.delete("/missions/deleteMission/:mission_id", authenticateToken, missions_controller.deleteMission);

// MISSION EMPLOYEES ROUTES
router.get("/mission_employees/getAllAssignedEmployees/", authenticateToken, mission_employees_controller.getAllAssignedEmployees);

// SALARIES ROUTES
router.get("/salaries/getAllSalaries/:params", authenticateToken, salaries_controller.getAllSalaries);

// PROJECT EMPLOYEES ROUTES

// LEAVES ROUTES
router.get("/leaves/getAllLeaves/:params", authenticateToken, leaves_controller.getAllLeaves);
router.get("/leaves/getAllLeavesById/:params", authenticateToken, leaves_controller.getAllLeavesById);
router.post("/leaves/requestLeave/", authenticateToken, leaves_controller.requestLeave);
router.put("/leaves/acceptLeaves/:params", authenticateToken, leaves_controller.acceptLeaves);
router.put("/leaves/rejectLeaves/:params", authenticateToken, leaves_controller.rejectLeaves);
router.put("/leaves/deleteLeaves/:params", authenticateToken, leaves_controller.deleteLeaves);
router.get("/leaves/getLeaveBalanceByEmployeeId/:params", authenticateToken, leaves_controller.getLeaveBalanceByEmployeeId);
// router.put("/leaves/resetEmployeeCreditLeave/:params", authenticateToken, leaves_controller.resetEmployeeCreditLeave);
router.put("/leaves/rejectExpiredLeaves/", authenticateToken, leaves_controller.rejectExpiredLeaves);

// LEAVE TYPES ROUTES
router.get("/leave_types/getAllLeaveTypes/", authenticateToken, leave_types_controller.getAllLeaveTypes);
router.post("/leave_types/addLeaveType/", authenticateToken, leave_types_controller.addLeaveType);

// HOLIDAYS ROUTES
router.get("/holidays/getAllHolidaysByYear/:params", authenticateToken, holidays_controller.getAllHolidaysByYear);
router.post("/holidays/addHoliday/", authenticateToken, holidays_controller.addHoliday);
router.put("/holidays/updateHoliday/:holiday_id", authenticateToken, holidays_controller.updateHoliday);

// COMPANY CONFIGS ROUTES
router.get("/company_configs/getCompanyConfigs/", authenticateToken, company_configs_controller.getCompanyConfigs);

// COMPANY ROUTES
router.get("/company/getCompanyInformations/", authenticateToken, company_controller.getCompanyInformations);
router.post("/company/addCompanyInformations/", authenticateToken, company_controller.addCompanyInformations);
router.put("/company/updateCompanyInformations/", authenticateToken, company_controller.updateCompanyInformations);

// VEHICLES ROUTES
router.get("/vehicles/getAllVehicles/:params", authenticateToken, vehicles_controller.getAllVehicles);
router.post("/vehicles/addVehicle/", authenticateToken, vehicles_controller.addVehicle);
router.put("/vehicles/updateVehicle/:id", authenticateToken, vehicles_controller.updateVehicle);
router.delete("/vehicles/deleteVehicle/:id", authenticateToken, vehicles_controller.deleteVehicle);
router.get("/vehicles/getVehicleById/:id", authenticateToken, vehicles_controller.getVehicleById);

// VEHICLE TYPES ROUTES
router.get("/vehicle_types/getAllVehicleTypes/", authenticateToken, vehicle_types_controller.getAllVehicleTypes);
router.post("/vehicle_types/addVehicleType/", authenticateToken, vehicle_types_controller.addVehicleType);

// HR STATS ROUTES
router.get("/hr_stats/getAllEmployeesBirthdays/", authenticateToken, hr_stats_controller.hrStatistics);

module.exports = router;
