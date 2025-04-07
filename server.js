const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Notifications';

// Middleware
app.use(express.json());

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

// Create notification
app.post('/api/notifications', async (req, res) => {
    try {
        const { title, content, startTime, endTime, userType } = req.body;

        // Validate required fields
        if (!title || !content || !startTime || !endTime || !userType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create notification item
        const notification = {
            id: Date.now().toString(),
            title,
            content,
            startTime,
            endTime,
            userType,
            createdAt: new Date().toISOString()
        };

        // Save to DynamoDB
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: notification
        }).promise();

        // Broadcast to connected clients
        const message = JSON.stringify(notification);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const params = {
            TableName: TABLE_NAME
        };

        const result = await dynamodb.scan(params).promise();
        res.json(result.Items);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get notification by ID
app.get('/api/notifications/:id', async (req, res) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id: req.params.id
            }
        };

        const result = await dynamodb.get(params).promise();
        
        if (!result.Item) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(result.Item);
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 