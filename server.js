require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
// const { sequelize } = require('./database/database.js');
// const { sequelize } = require('./database/database_supabase.js');
const { sequelize } = require('./database/database_supabase_2.js');

const Routes = require('./routes/routes.js');
require('./Cron Jobs/leave_crons.js');
const { initSocket } = require("./socket");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

app.use('/api', Routes);

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PGHOST:', process.env.PGHOST);
console.log('PGDATABASE:', process.env.PGDATABASE);

sequelize.authenticate().then(() => {
    const server = http.createServer(app);
    initSocket(server);
    server.listen(port, () => {
      console.log(`Server is running on PORT:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the DB:', err);
  });
