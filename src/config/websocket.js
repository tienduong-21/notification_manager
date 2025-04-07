const clients = new Set();

const setupWebSocket = (wss) => {
    wss.on('connection', (ws) => {
        clients.add(ws);
        console.log('New client connected');

        ws.on('close', () => {
            clients.delete(ws);
            console.log('Client disconnected');
        });
    });
};

const broadcastMessage = (message) => {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
};

module.exports = {
    setupWebSocket,
    broadcastMessage
}; 