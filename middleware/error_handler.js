const { CustomAPIError } = require('../errors/custom_error');

const errorHandlerMiddleware = (err, req, res, next) => {
    // Handle CustomAPIError
    if (err instanceof CustomAPIError) {
        console.log(`Status code ${err.statusCode}`, `Message: ${err.message}`);
        return res.status(404).render('not_found');
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
    return res.status(404).render('not_found');
}

module.exports = errorHandlerMiddleware;
