const SequelizeAuto = require("sequelize-auto");

const auto = new SequelizeAuto("sunstone_test", "root", "", {
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    logging: (msg) => console.log(`Db: "127.0.0.1" - ${msg}`),
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
});

try {
    auto.run((err) => {
        if (err) throw err;
        console.log(auto.tables);
        console.log(auto.foreignKeys);
    });
} catch (error) {
    console.log(error);
}