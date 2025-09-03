const cron = require("node-cron");
const employeesControllers = require("../controllers/employees.controlers");

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
    await employeesControllers.resetLeaveCreditEveryYear();
    console.log("-- Cron job finished successfully!");
  } catch (error) {
    console.error("-- Failed to run this job!", error);
  }
});

