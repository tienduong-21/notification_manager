const AWS = require('aws-sdk');
const crypto = require('crypto');
require('dotenv').config();

const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: process.env.WEBSOCKET_API_ENDPOINT
});

const customerService = require('../db/customerService');

class WebSocketService {
    // Hash userEmail to create connectionId
    generateConnectionId = (userEmail) => {
        return crypto.createHash('sha256').update(userEmail).digest('hex');
    };

    // Get user from customer table
    getUserFromCustomerTable = async (userEmail) => {
        return customerService.getUserByEmail(userEmail);
    };

    // Store connection ID in customer table
    storeConnection = async (connectionId, userEmail) => {
        await customerService.updateUserConnection(userEmail, connectionId);
    };

    // Get connection ID by user email
    getConnectionByEmail = async (userEmail) => {
        const user = await this.getUserFromCustomerTable(userEmail);
        return user?.connectionId;
    };

    // Send message to specific user
    sendMessageToUser = async (userEmail, message) => {
        try {
            const connectionId = await this.getConnectionByEmail(userEmail);
            if (!connectionId) {
                console.log(`No active connection found for user: ${userEmail}`);
                return false;
            }

            await apigatewaymanagementapi.postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify(message)
            }).promise();
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    };

    // Handle disconnection
    handleDisconnect = async (connectionId) => {
        await customerService.removeUserConnection(connectionId);
    };

    // Send notification
    sendNotification = async (notification) => {
        return this.sendMessageToUser(notification.userEmail, {
            type: 'NOTIFICATION',
            data: {
                id: notification.id,
                title: notification.title,
                content: notification.content,
                startTime: notification.startTime,
                endTime: notification.endTime
            }
        });
    };
}

module.exports = new WebSocketService(); 