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

const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*splat', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

app.use('/api', Routes);

// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server is running on PORT:${port}`);
// });

try {
  const u = new URL(process.env.DATABASE_URL);
  console.log('DB host:', u.hostname, 'port:', u.port, 'db:', u.pathname);
} catch {}

sequelize.authenticate()
  .then(() => {
   console.log("connected to the DB successfully.");
   
  })
  .catch(err => {
    console.error('Unable to connect to the DB:', err);
  });
