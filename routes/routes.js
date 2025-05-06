const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users.controllers");
const roles_controller = require("../controllers/roles.controllers");
const employees_controller = require("../controllers/employees.controlers");
const contracts_controlers = require("../controllers/contracts.controlers");
const contract_types_controller = require("../controllers/contract_types.controllers");
const employee_bank_details_controller = require("../controllers/employee_bank_details.controllers");


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

// CONTRACTS ROUTES
router.get("/contracts/getAllContracts/", contracts_controlers.getAllContracts);

// CONTRACT TYPES ROUTES
router.get("/contract_types/getAllContractTypes/", contract_types_controller.getAllContractTypes);

// EMPLOYEE BANK DETAILS ROUTES
router.get("/employee_bank_details/getAllEmployeeBankDetails/", employee_bank_details_controller.getAllEmployeeBankDetails);


module.exports = router;
