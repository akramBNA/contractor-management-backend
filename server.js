require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/database_supabase_2'); // your working pooler URL

const app = express();
const PORT = process.env.PORT || 3000;

// CORS & JSON
app.use(cors({ origin: ['http://localhost:4200', /* add your deployed FE here */], credentials: true }));
app.use(express.json());

// Health check so Render can verify readiness
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Start HTTP FIRST so Render sees an open port
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP listening on ${PORT}`);
});

// (If you use websockets)
// const { initSocket } = require('./socket');
// initSocket(server);

// Your routes
app.use('/api', require('./routes/routes'));

// Connect to DB (don’t exit if it fails; just log)
(async () => {
  try {
    // Optional: log what we’re connecting to
    const u = new URL(process.env.DATABASE_URL);
    console.log('DB host:', u.hostname, 'port:', u.port, 'db:', u.pathname);
    await sequelize.authenticate();
    console.log('DB connected');
  } catch (err) {
    console.error('DB connection failed:', err);
  }
})();
