require('dotenv').config();

const cron = require("node-cron");
const employeesControllers = require("../controllers/employees.controlers");
const leavesControllers = require("../controllers/leaves.controllers");

cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("-- Cron job started: Adding leave credits...");
    employeesControllers.addLeaveCreditEveryMonth();
    console.log("-- Cron job finished successfully!");
  } catch (error) {
    console.log("-- failed to ran this job!");
  }
});

cron.schedule("0 0 1 1 *", async () => {
  try {
    console.log("-- Cron job started: Resetting leave credits...");
    leavesControllers.resetEmployeeCreditLeave();
    console.log("-- Cron job finished successfully!");
  } catch (error) {
    console.error("-- Failed to run this job!", error);
  }
});

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("-- Cron job started: Rejecting expired leaves...");
    leavesControllers.rejectExpiredLeaves();
    console.log("-- Cron job finished successfully!");
  } catch (error) {
    console.error("-- Failed to run this job!", error);
  }
});

