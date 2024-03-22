const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { UserRoutes, AuthRoutes } = require("./routes");
const loaders = require("./loaders");
const app = express();

config();
loaders();

app.use(express.json());
app.use(helmet());

app.listen(process.env.APP_PORT, () => {
    app.use("/v1/api/User", UserRoutes);
    app.use("/v1/api/Auth", AuthRoutes);
    console.log("Sunucu ayağa kalktı. Port :", process.env.APP_PORT);
});