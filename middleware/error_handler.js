const { CustomAPIError } = require('../errors/custom_error');

const errorHandlerMiddleware = (err, req, res, next) => {
    // Handle CustomAPIError
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }

    // Provide more information in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorDetails = isDevelopment ? {
        message: err.message,
        stack: err.stack,
        // Add more details as needed
    } : { msg: 'Something went wrong, please try again.' };

    // Log the error for the server admin
    console.error(err);

    // Send response
    return res.status(500).json(errorDetails);
}

module.exports = errorHandlerMiddleware;
