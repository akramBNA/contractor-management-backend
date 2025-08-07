const cron = require('node-cron');
const employeesDao = require('../dao/employees.dao');

cron.schedule('* * * * *', async () =>{
    const employeesDao = new (require('../dao/employees.dao'))();
    employeesDao.addLeaveCreditEveryMonth().then(()=>{
        
        console.log("** Running every minute! **");
    })
});