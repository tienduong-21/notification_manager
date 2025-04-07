const express = require('express');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const { setupWebSocket } = require('./config/websocket');
const { setupRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const notificationCron = require('./cron/notificationCron');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());

// Setup WebSocket
setupWebSocket(wss);

// Setup Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start notification cron job
notificationCron.start();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 