const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');
const app = require('./app');

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing server...`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error(`Startup Error: ${error.message}`);
  process.exit(1);
});
