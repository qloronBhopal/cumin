require("dotenv").config();
const { styledColorLogger } = require("../../helper/styledLogger");
const { showDevLogsAndResponse } = require("../appConfig");

const {
    PROD_DBPORT: port,
    PROD_DBUSER: username,
    PROD_DBPASS: password,
    PROD_DBNAME: DBname,
    PROD_DBHOST: host,
    PROD_DIALECT: dialect
} = process.env;

module.exports = {
        username,
        password,
        DBname,
        dbObj: {
            host,
            port,
            dialect,
            logging: (val) => showDevLogsAndResponse && console.log(`Db ${host} - Log: ${val}`),
            define: {
                timestamps: false
            },
            dialectOptions: {
                charset: "utf8mb4"
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            timezone: "+05:30"
        },
        onSuccess: (msg) => {
            styledColorLogger.success(`Db: ${host} - ${msg}`);
        },
        onError: (error, errIn = "") => {
                styledColorLogger.error(`Db: ${host} - Connection Error${errIn ? ` in-${errIn}` : errIn}: ${error}`);
  }
};