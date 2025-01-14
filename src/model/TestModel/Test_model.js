const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../../../public/config/db");

// Define the Tag model
const testTagModel = sequelize.define(
  "Test_Tags",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Test_Tags", // Name of the table in MySQL
    timestamps: false, // Disable automatic createdAt and updatedAt columns
  }
);

// Define the Attr model
const testAttrModel = sequelize.define(
  "Test_Attrs",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Test_Attrs", // Name of the table in MySQL
    timestamps: false, // Disable automatic createdAt and updatedAt columns
  }
);

module.exports = { testTagModel, testAttrModel };
