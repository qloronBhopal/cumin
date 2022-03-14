const path = require("path");

// global.rootDirPath = path.join(`${__dirname}\\..\\`);
const express = require("express");

const app = express();
const clc = require("cli-color");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("../config/cors");
const config = require("../config/appConfig");
require("dotenv").config();
require("./api/v1/models").connect();

app.use(logger("dev"));

app.use(
  express.json({
    limit: "50mb"
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true
  })
);
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

cors(app);

app.use(config.staticFilesUrlRoute, express.static(path.join(__dirname, "..\\", config.uploadPath)));

app.use(fileUpload());

app.use("/api", require("./api"));

app.use((req, res, next) => {
  const error = new Error(`404_Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: 0,
    isError: true,
    message: "Route Not Found!",
    msg: err.message,
    data: config.showDevLogsAndResponse ? err.stack : {},
    err,
    errorCode: statusCode,
    success: false
  });
});

const PORT = process.env.PORT || config.server.PORT;
const server = app.listen(PORT, () => {
  console.log(
    clc.green("[*]"),
    `Server: ListeningOn Port: ${PORT} And ${
      process.env.TEST_ENV ? "ENV variables fetch successfully!" : "can't get ENV variables"
    }`
  );
});
