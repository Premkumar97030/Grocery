const { databaseStatus } = require('../config/db');

const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Grocery Delivery API is running',
    data: {
      status: 'healthy',
      database: databaseStatus(),
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { getHealth };
