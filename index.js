const express = require("express");

const { PORT } = require("./config");
const databaseConfig = require("./config/database");
const expressConfig = require("./config/express");
const routesConfig = require("./config/routes");

async function startApp() {

const app = express();
await databaseConfig();
expressConfig(app);
routesConfig(app);
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
};

startApp();