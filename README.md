# Notification Manager

A real-time notification system that allows scheduling and sending notifications to users at specific times using AWS WebSocket API Gateway.

## Features

- Create notifications with title, content, start time, and end time
- Real-time notification delivery using AWS WebSocket API Gateway
- Automatic notification scheduling using cron jobs
- Status tracking for notifications (PENDING, SENT, FAILED)
- DynamoDB integration for persistent storage
- User-specific notifications using email addresses

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with:
  - DynamoDB access
  - API Gateway WebSocket API
  - IAM roles with appropriate permissions

## AWS Setup

1. Create a WebSocket API in API Gateway:
   - Go to AWS Console > API Gateway
   - Create a new WebSocket API
   - Note down the WebSocket API endpoint

2. Create DynamoDB tables:
   ```bash
   # Notifications table
   aws dynamodb create-table \
     --table-name Notifications \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

   # Connections table
   aws dynamodb create-table \
     --table-name Connections \
     --attribute-definitions AttributeName=connectionId,AttributeType=S AttributeName=userEmail,AttributeType=S \
     --key-schema AttributeName=connectionId,KeyType=HASH AttributeName=userEmail,KeyType=RANGE \
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

3. Create IAM role with permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:PutItem",
           "dynamodb:GetItem",
           "dynamodb:UpdateItem",
           "dynamodb:DeleteItem",
           "dynamodb:Query",
           "dynamodb:Scan"
         ],
         "Resource": [
           "arn:aws:dynamodb:*:*:table/Notifications",
           "arn:aws:dynamodb:*:*:table/Connections"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "execute-api:ManageConnections"
         ],
         "Resource": "arn:aws:execute-api:*:*:*/*/*/*/@connections/*"
       }
     ]
   }
   ```

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
DYNAMODB_TABLE=Notifications
CONNECTION_TABLE=Connections
WEBSOCKET_API_ENDPOINT=your_websocket_api_endpoint
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
    "userType": "ALL",
    "userEmail": "user@example.com"
  }'
```

3. Connect to WebSocket:
```javascript
const ws = new WebSocket('your_websocket_api_endpoint');

ws.onopen = () => {
  // Send authentication message with user email
  ws.send(JSON.stringify({
    action: 'authenticate',
    email: 'user@example.com'
  }));
};

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Received notification:', notification);
};
```

## API Endpoints

- `POST /api/notifications` - Create a new notification
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get a specific notification
- `GET /api/notifications/user/:email` - Get notifications for a specific user

## WebSocket Events

The server sends notifications through WebSocket when they are due to be sent. Messages are sent only to the specific user's email address.

## License

MIT 