const cron = require('node-cron');


cron.schedule('0 0 1 * *', async () =>{
    console.log("Running every month!");
    
})