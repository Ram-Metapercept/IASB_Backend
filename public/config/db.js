const { Sequelize } = require("sequelize");

// Set up Sequelize for MySQL
const sequelize = new Sequelize("iasbdatabase", "root", "ram@12345", {
    host: "localhost", // Replace with your database host
    dialect: "mysql",
  });
  

  module.exports=sequelize