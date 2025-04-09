const websocketService = require('./websocketService');

const handleConnect = async (event) => {
    const userEmail = JSON.parse(event.body).email;
    const connectionId = websocketService.generateConnectionId(userEmail);

    try {
        // Verify user exists in customer table
        const user = await websocketService.getUserFromCustomerTable(userEmail);
        if (!user) {
            return {
                statusCode: 404,
                body: 'User not found'
            };
        }

        // Store connection
        await websocketService.storeConnection(connectionId, userEmail);
        return {
            statusCode: 200,
            body: 'Connected successfully'
        };
    } catch (error) {
        console.error('Error in handleConnect:', error);
        return {
            statusCode: 500,
            body: 'Failed to connect'
        };
    }
};

const handleDisconnect = async (event) => {
    const connectionId = event.requestContext.connectionId;

    try {
        await websocketService.handleDisconnect(connectionId);
        return {
            statusCode: 200,
            body: 'Disconnected successfully'
        };
    } catch (error) {
        console.error('Error in handleDisconnect:', error);
        return {
            statusCode: 500,
            body: 'Failed to disconnect'
        };
    }
};

const handleDefault = async (event) => {
    return {
        statusCode: 200,
        body: 'Default route'
    };
};

module.exports = {
    handleConnect,
    handleDisconnect,
    handleDefault
}; 