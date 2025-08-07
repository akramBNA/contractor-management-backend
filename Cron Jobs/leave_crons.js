const cron = require("node-cron");
const employeesControllers = require("../controllers/employees.controlers");

cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("-- Cron job started: Adding leave credits...");
    employeesControllers.addLeaveCreditEveryMonth();
  } catch (error) {
    console.log("-- failed to ran this job!");
  }
});
