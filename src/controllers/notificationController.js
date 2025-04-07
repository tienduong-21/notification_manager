const notificationService = require('../services/notificationService');

class NotificationController {
    async create(req, res, next) {
        try {
            const notification = await notificationService.create(req.body);
            res.status(201).json(notification);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const notifications = await notificationService.getAll();
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const notification = await notificationService.getById(req.params.id);
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            res.json(notification);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController(); 