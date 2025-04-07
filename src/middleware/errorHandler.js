const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.message === 'Missing required fields') {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = {
    errorHandler
}; 