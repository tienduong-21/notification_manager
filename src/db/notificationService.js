const AWS = require('aws-sdk');
require('dotenv').config();

const dynamodb = new AWS.DynamoDB.DocumentClient();
const notificationTable = process.env.NOTIFICATION_TABLE;

class NotificationDBService {
    // Create notification
    create = async (notification) => {
        await dynamodb.put({
            TableName: notificationTable,
            Item: notification
        }).promise();
        return notification;
    };

    // Get all notifications
    getAll = async () => {
        const result = await dynamodb.scan({
            TableName: notificationTable
        }).promise();
        return result.Items;
    };

    // Get notification by ID
    getById = async (id) => {
        const result = await dynamodb.get({
            TableName: notificationTable,
            Key: { id }
        }).promise();
        return result.Item;
    };

    // Get notifications by user email
    getByUserEmail = async (userEmail) => {
        const result = await dynamodb.scan({
            TableName: notificationTable,
            FilterExpression: 'userEmail = :userEmail',
            ExpressionAttributeValues: {
                ':userEmail': userEmail
            }
        }).promise();
        return result.Items;
    };

    // Get pending notifications
    getPendingNotifications = async () => {
        const now = new Date().toISOString();
        const result = await dynamodb.scan({
            TableName: notificationTable,
            FilterExpression: '#status = :status AND #startTime <= :now AND #endTime >= :now',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#startTime': 'startTime',
                '#endTime': 'endTime'
            },
            ExpressionAttributeValues: {
                ':status': 'PENDING',
                ':now': now
            }
        }).promise();
        return result.Items;
    };

    // Update notification status
    updateStatus = async (id, status) => {
        await dynamodb.update({
            TableName: notificationTable,
            Key: { id },
            UpdateExpression: 'SET #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': status
            }
        }).promise();
    };
}

module.exports = new NotificationDBService(); 