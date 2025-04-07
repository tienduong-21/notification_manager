const cron = require('node-cron');
const { dynamodb, TABLE_NAME } = require('../config/aws');
const { broadcastMessage } = require('../config/websocket');

class NotificationCron {
    constructor() {
        // Run every minute
        this.schedule = cron.schedule('* * * * *', () => this.checkAndSendNotifications());
    }

    async checkAndSendNotifications() {
        try {
            const now = new Date();
            const result = await dynamodb.scan({
                TableName: TABLE_NAME
            }).promise();

            for (const notification of result.Items) {
                const startTime = new Date(notification.startTime);
                const endTime = new Date(notification.endTime);

                // Check if current time is between start and end time
                if (now >= startTime && now <= endTime && notification.status === 'PENDING') {
                    try {
                        // Send notification
                        broadcastMessage(notification);

                        // Update status to SENT
                        await dynamodb.update({
                            TableName: TABLE_NAME,
                            Key: { id: notification.id },
                            UpdateExpression: 'SET #status = :status',
                            ExpressionAttributeNames: {
                                '#status': 'status'
                            },
                            ExpressionAttributeValues: {
                                ':status': 'SENT'
                            }
                        }).promise();

                        console.log(`Notification ${notification.id} sent successfully`);
                    } catch (error) {
                        console.error(`Error sending notification ${notification.id}:`, error);
                        // Update status to FAILED
                        await dynamodb.update({
                            TableName: TABLE_NAME,
                            Key: { id: notification.id },
                            UpdateExpression: 'SET #status = :status',
                            ExpressionAttributeNames: {
                                '#status': 'status'
                            },
                            ExpressionAttributeValues: {
                                ':status': 'FAILED'
                            }
                        }).promise();
                    }
                }
            }
        } catch (error) {
            console.error('Error in notification cron job:', error);
        }
    }

    start() {
        this.schedule.start();
        console.log('Notification cron job started');
    }

    stop() {
        this.schedule.stop();
        console.log('Notification cron job stopped');
    }
}

module.exports = new NotificationCron(); 