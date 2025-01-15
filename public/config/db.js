const { Sequelize } = require("sequelize");
require("dotenv").config();
// Set up Sequelize for MySQL
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST, 
    dialect: "mysql",
  }
);

module.exports = sequelize;
