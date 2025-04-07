const { dynamodb, TABLE_NAME } = require('../config/aws');
const Notification = require('../models/notification');

class NotificationService {
    async create(notificationData) {
        const notification = new Notification(notificationData);
        notification.validate();

        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: notification
        }).promise();

        return notification;
    }

    async getAll() {
        const result = await dynamodb.scan({
            TableName: TABLE_NAME
        }).promise();
        return result.Items;
    }

    async getById(id) {
        const result = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: { id }
        }).promise();
        return result.Item;
    }
}

module.exports = new NotificationService(); 