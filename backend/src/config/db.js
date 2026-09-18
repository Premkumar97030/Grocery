import mongoose from 'mongoose';
export async function connectDatabase(uri) { mongoose.connection.on('error', (error) => console.error(`MongoDB error: ${error.message}`)); await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }); console.log(`MongoDB connected: ${mongoose.connection.host}`); }
export function databaseStatus() { return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'; }
