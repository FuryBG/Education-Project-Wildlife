const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("../config");

module.exports = async() => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_CONNECTION_STRING);

        let connection = mongoose.connection;

        connection.once("open", () => {
            console.log("database connected!");
            resolve();
        });

        connection.on("error", () => {
            console.log("database error!");
            reject();
        });
    });
};