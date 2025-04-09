const AWS = require('aws-sdk');
require('dotenv').config();

const dynamodb = new AWS.DynamoDB.DocumentClient();
const customerTable = process.env.CUSTOMER_TABLE;

class CustomerService {
    // Get user by email
    getUserByEmail = async (email) => {
        const result = await dynamodb.get({
            TableName: customerTable,
            Key: {
                email
            }
        }).promise();
        return result.Item;
    };

    // Update user connection
    updateUserConnection = async (email, connectionId) => {
        await dynamodb.update({
            TableName: customerTable,
            Key: {
                email
            },
            UpdateExpression: 'SET connectionId = :connectionId, lastConnected = :timestamp',
            ExpressionAttributeValues: {
                ':connectionId': connectionId,
                ':timestamp': new Date().toISOString()
            }
        }).promise();
    };

    // Remove user connection
    removeUserConnection = async (connectionId) => {
        await dynamodb.update({
            TableName: customerTable,
            Key: {
                connectionId
            },
            UpdateExpression: 'REMOVE connectionId, lastConnected'
        }).promise();
    };

    // Get user by connection ID
    getUserByConnectionId = async (connectionId) => {
        const result = await dynamodb.scan({
            TableName: customerTable,
            FilterExpression: 'connectionId = :connectionId',
            ExpressionAttributeValues: {
                ':connectionId': connectionId
            }
        }).promise();
        return result.Items[0];
    };
}

module.exports = new CustomerService(); 