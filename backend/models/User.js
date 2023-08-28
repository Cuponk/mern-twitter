const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = Mongoose.model('User', UserSchema);