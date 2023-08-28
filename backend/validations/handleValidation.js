const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errorFormatter = ({msg}) => msg;
        const errors = validationErrors.formatWith(errorFormatter).mapped();

        const err = Error("Bad Request");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request.";
        next(err);
    }
    next();
};

module.exports = handleValidationErrors