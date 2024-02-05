const mongoose = require('mongoose');

// Middleware to validate ':id' parameter
function validateId(req, res, next) {
    const id = req.params.id;

    if (id) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).render('not_found');
        }
    }
    next();
}

module.exports = validateId;