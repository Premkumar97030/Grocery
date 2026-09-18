const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const seedData = require('./utils/seeder');

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Seed initial data if database is empty
    await seedData();

    // 3. Start Express server
    const server = app.listen(config.port, () => {
      console.log(
        `[Server] FreshCart Grocery Backend is running in ${config.nodeEnv} mode on http://localhost:${config.port}`
      );
      console.log(`[Server] Health Check available at http://localhost:${config.port}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Server] Unhandled Rejection: ${err.message}`);
      // server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('[Server] Failed to initialize server:', err.message);
    process.exit(1);
  }
};

startServer();
