const Notification = require('../models/notification');
const notificationDB = require('../db/notificationService');

class NotificationService {
    create = async (notificationData) => {
        const notification = new Notification(notificationData);
        notification.validate();

        return notificationDB.create(notification);
    };

    getAll = async () => {
        return notificationDB.getAll();
    };

    getById = async (id) => {
        return notificationDB.getById(id);
    };

    getByUserEmail = async (userEmail) => {
        return notificationDB.getByUserEmail(userEmail);
    };

    getPendingNotifications = async () => {
        return notificationDB.getPendingNotifications();
    };

    updateStatus = async (id, status) => {
        return notificationDB.updateStatus(id, status);
    };
}

module.exports = new NotificationService(); 