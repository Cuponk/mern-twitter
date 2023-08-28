const { check } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors');

const validateRegisterInput = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 30 })
        .withMessage('Please provide a username between 4 and 30 characters.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6, max: 30 })
        .withMessage('Please provide a password between 6 and 30 characters.'),
    handleValidationErrors
];

module.exports = validateRegisterInput;
