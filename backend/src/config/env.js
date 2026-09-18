const required = ['MONGODB_URI', 'JWT_SECRET'];
export function validateEnv(env) { const missing = required.filter((key) => !env[key]); if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`); }
