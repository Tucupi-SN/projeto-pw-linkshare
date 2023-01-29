const { Sequelize } = require("sequelize");
const path = require("path");

let sqliteDabatasePath = path.join(__dirname, "..", "database.sqlite3");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: sqliteDabatasePath,
});

module.exports = sequelize;
