const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middlewares/auth");
const productsMiddleware = require("../middlewares/post");

module.exports = (app) => {
    app.engine("hbs", hbs.engine({
        extname: "hbs"
    }));
    app.use("/static", express.static("static"));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(productsMiddleware());
};