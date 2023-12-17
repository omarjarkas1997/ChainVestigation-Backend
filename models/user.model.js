const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: MIN_PASSWORD_LENGTH
    },
    roles: {
        type: [String],
        enum: ['USER', 'ADMIN', 'GUEST'],
        default: ['user']
    }
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        next(error); // Pass the error to Mongoose to handle it
    }
});

// Method to check the entered password with the hashed password
userSchema.methods.checkPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error("Error comparing password: ", error);
        throw new Error("Error comparing password");
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
