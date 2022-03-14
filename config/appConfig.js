require("dotenv").config();

const { SECRETKEYJWT: secretKeyJwt } = process.env;

module.exports = {
  server: {
    PORT: 3001,
    NODE_ENVIR: "development", // enum: ["development", "production", "local"]
    domain: "http://localhost:3001"
  },
  apiKeys: {
    smsKey: "",
    mailKey: ""
  },
  secretKeyJwt,
  bcryptSaltRound: 10,
  staticFilesUrlRoute: "/static",
  uploadPath: "\\public\\uploads\\",
  showDevLogsAndResponse: false
};
