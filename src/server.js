const express = require('express');
require('dotenv').config();

const { setupRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const notificationCron = require('./cron/notificationCron');

const app = express();

// Middleware
app.use(express.json());

// Setup Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start notification cron job
notificationCron.start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 