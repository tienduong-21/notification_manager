const cron = require('node-cron');
const notificationService = require('../services/notificationService');
const websocketService = require('../websocket/websocketService');

class NotificationCron {
    constructor() {
        // Run every minute
        this.schedule = cron.schedule('* * * * *', () => this.checkAndSendNotifications());
    }

    checkAndSendNotifications = async () => {
        try {
            // Get notifications that are due to be sent
            const pendingNotifications = await notificationService.getPendingNotifications();
            
            for (const notification of pendingNotifications) {
                try {
                    // Send notification through WebSocket
                    const success = await websocketService.sendNotification(notification);

                    // Update notification status
                    await notificationService.updateStatus(
                        notification.id,
                        success ? 'SENT' : 'FAILED'
                    );

                    console.log(`Notification ${notification.id} sent successfully to ${notification.userEmail}`);
                } catch (error) {
                    console.error(`Error sending notification ${notification.id}:`, error);
                    await notificationService.updateStatus(notification.id, 'FAILED');
                }
            }
        } catch (error) {
            console.error('Error in notification cron job:', error);
        }
    };

    start = () => {
        this.schedule.start();
        console.log('Notification cron job started');
    };

    stop = () => {
        this.schedule.stop();
        console.log('Notification cron job stopped');
    };
}

module.exports = new NotificationCron(); 