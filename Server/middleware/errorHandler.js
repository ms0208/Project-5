const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'server Error';
    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }
    if (err.code === 11000) {
        const field = Objects.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 400;
    }

    if (err.code === 'ValidationError') {
        message = Objects.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File size exceeds';
        statusCode = 400;
    }
    if (err.code === 'JsonWebTokenError') {
        message = 'Invalid error';
        statusCode = 400;
    }
    if (err.code === 'TokenExpiredError') {
        message = 'Token Expired';
        statusCode = 400;
    }
    console.error('Error:', {
        message: err.message,
        status: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
export default errorHandler;