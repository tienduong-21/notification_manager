# Notification Manager

A real-time notification system that allows scheduling and sending notifications to users at specific times.

## Features

- Create notifications with title, content, start time, and end time
- Real-time notification delivery using WebSocket
- Automatic notification scheduling using cron jobs
- Status tracking for notifications (PENDING, SENT, FAILED)
- DynamoDB integration for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- AWS DynamoDB
- WebSocket client

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tienduong-21/notification_manager.git
cd notification_manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=3000
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
DYNAMODB_TABLE=your_table_name
```

## Usage

1. Start the server:
```bash
npm start
```

2. Create a notification:
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Reminder",
    "content": "Team meeting in 5 minutes",
    "startTime": "2024-04-10T10:00:00Z",
    "endTime": "2024-04-10T10:30:00Z",
    "userType": "ALL"
  }'
```

## API Endpoints

- `POST /api/notifications` - Create a new notification
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get a specific notification

## WebSocket Events

The server broadcasts notifications through WebSocket when they are due to be sent.

## License

MIT 