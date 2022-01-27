const authController = require("../controllers/authController");
const productsController = require("../controllers/productsController");

module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", productsController);
};