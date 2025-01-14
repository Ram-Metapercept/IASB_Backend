const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../public/config/db");

// Define the Tag model for Set C
const TagSetC = sequelize.define(
  "IASB_Set_C_Tags",
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
    timestamps: false, // Disable automatic timestamps if you don't want updatedAt
  }
);

// Define the Attribute model for Set C
const AttrSetC = sequelize.define(
  "IASB_Set_C_Attributes",
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
    timestamps: false, // Disable automatic timestamps if you don't want updatedAt
  }
);

// Export the models
module.exports = { TagSetC, AttrSetC };
