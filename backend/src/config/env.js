const dotenv = require('dotenv');
const path = require('path');

// Load environment from backend/.env or root .env
dotenv.config({ path: path.join(__dirname, '../../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();


/**
 * Sanitizes environment variable values by trimming, stripping accidental 'KEY=' prefixes,
 * and removing surrounding single/double quotes often pasted into cloud dashboards (e.g. Render).
 */
const cleanEnv = (val, fallback = '') => {
  if (val === undefined || val === null) return fallback;
  let cleaned = String(val).trim();
  // Strip KEY= prefix if user accidentally pasted the whole variable line (e.g. MONGODB_URI="mongodb+srv://...")
  cleaned = cleaned.replace(/^[A-Za-z0-9_]+\s*=\s*/, '');
  // Strip surrounding double or single quotes
  cleaned = cleaned.replace(/^["'](.*)["']$/, '$1').trim();
  return cleaned || fallback;
};

const config = {
  port: parseInt(cleanEnv(process.env.PORT, '5000'), 10),
  nodeEnv: cleanEnv(process.env.NODE_ENV, 'development'),
  mongoUri: cleanEnv(
    process.env.MONGODB_URI,
    'mongodb://127.0.0.1:27017/grocery_delivery_db'
  ),
  jwtSecret: cleanEnv(
    process.env.JWT_SECRET,
    'grocery_secret_super_key_2026_secure_token'
  ),
  jwtExpire: cleanEnv(process.env.JWT_EXPIRE, '30d'),
  clientUrl: cleanEnv(process.env.CLIENT_URL, 'http://localhost:5173'),
  useMemoryDbFallback: cleanEnv(process.env.USE_MEMORY_DB_FALLBACK, 'true') !== 'false',
};

module.exports = config;

