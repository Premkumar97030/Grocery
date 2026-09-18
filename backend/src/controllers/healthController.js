import { databaseStatus } from '../config/db.js';
export function getHealth(_request, response) { return response.status(200).json({ success: true, message: 'Grocery Delivery API is running', data: { database: databaseStatus() } }); }
