const cron = require('node-cron');
const { addLeaveCreditEveryMonth } = require('../controllers/employees.controlers');
// const employeesDao = require('../dao/employees.dao');

cron.schedule('* * * * *', async () =>{
    // const employeeConrollers = new (require('../controllers/employees.controlers'))();
    const  employyesControllers = require('../controllers/employees.controlers')
    employyesControllers.addLeaveCreditEveryMonth();
    console.log("** Running every minute! **");
});