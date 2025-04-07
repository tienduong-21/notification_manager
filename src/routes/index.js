const express = require('express');
const notificationController = require('../controllers/notificationController');

const setupRoutes = (app) => {
    const router = express.Router();

    // Notification routes
    router.post('/notifications', notificationController.create);
    router.get('/notifications', notificationController.getAll);
    router.get('/notifications/:id', notificationController.getById);

    // Mount all routes under /api
    app.use('/api', router);
};

module.exports = {
    setupRoutes
}; 