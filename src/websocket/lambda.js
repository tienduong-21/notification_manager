const { handleConnect, handleDisconnect, handleDefault } = require('./handlers');

exports.handler = async (event) => {
    const routeKey = event.requestContext.routeKey;

    switch (routeKey) {
        case '$connect':
            return handleConnect(event);
        case '$disconnect':
            return handleDisconnect(event);
        default:
            return handleDefault(event);
    }
}; 