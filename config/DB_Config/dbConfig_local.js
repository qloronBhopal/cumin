require("dotenv").config();
const { styledColorLogger } = require("../../helper/styledLogger");
const { showDevLogsAndResponse } = require("../appConfig");

const {
    LOCAL_DBPORT: port,
    LOCAL_DBUSER: username,
    LOCAL_DBPASS: password,
    LOCAL_DBNAME: DBname,
    LOCAL_DBHOST: host,
    LOCAL_DIALECT: dialect
} = process.env;

module.exports = {
        username,
        password,
        DBname,
        dbObj: {
            host,
            port,
            dialect,
            logging: (msg) => showDevLogsAndResponse && styledColorLogger.success(`Db: ${host} - ${msg}`),
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