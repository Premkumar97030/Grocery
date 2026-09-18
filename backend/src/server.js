import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { validateEnv } from './config/env.js';
const port = Number(process.env.PORT || 5000);
validateEnv(process.env);
const server = app.listen(port, () => console.log(`API listening at http://localhost:${port}`));
connectDatabase(process.env.MONGODB_URI).catch((error) => console.error(`MongoDB unavailable: ${error.message}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
