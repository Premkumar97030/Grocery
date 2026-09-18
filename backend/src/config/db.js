const mongoose = require('mongoose');
const config = require('./env');

let memoryServer = null;

const connectDB = async () => {
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] MongoDB Connected successfully to: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to primary MongoDB (${err.message}).`);

    if (config.useMemoryDbFallback) {
      console.log('[DB] Starting embedded MongoMemoryServer for development fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memoryUri = memoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`[DB] In-Memory MongoDB connected successfully at: ${memoryUri}`);
      } catch (memErr) {
        console.error('[DB] Failed to start In-Memory MongoDB:', memErr.message);
        throw memErr;
      }
    } else {
      console.error('[DB] Fatal Database Connection Error:', err);
      process.exit(1);
    }
  }
};

const databaseStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[DB] MongoDB disconnected.');
  } catch (err) {
    console.error('[DB] Error during disconnection:', err.message);
  }
};

module.exports = { connectDB, databaseStatus, disconnectDB };
