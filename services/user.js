const User = require("../models/User");

async function createUser(firstName, lastName, email, hashedPassword) {
    const newUser = new User({
        firstName,
        lastName,
        email,
        hashedPassword
    });
    await newUser.save();
    return newUser;
};

async function getUserByEmail(email) {
    let userRegEx = new RegExp(`^${email}$`, "i");
    const currUser = await User.findOne({email:{$regex: userRegEx}});
    return currUser;
};

module.exports = {
    createUser,
    getUserByEmail
};