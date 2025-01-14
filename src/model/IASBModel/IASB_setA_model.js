const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../public/config/db");

// Define the Tag model
const TagSetA = sequelize.define(
  "IASB_Set_A_Tags",
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

// Define the Attribute model
const AttrSetA = sequelize.define(
  "IASB_Set_A_Attributes",
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
module.exports = { TagSetA, AttrSetA };
