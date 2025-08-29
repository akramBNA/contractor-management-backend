require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const Routes = require('./routes/routes.js');
// const { sequelize } = require('./database/database.js');
// const { sequelize } = require('./database/database_supabase.js');
const { sequelize } = require('./database/database_supabase_2.js');

const { initSocket } = require("./socket");
// initSocket(server);
require('./Cron Jobs/leave_crons.js');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

app.use('/api', Routes);

sequelize.authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on PORT:${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the DB:', err);
  });
