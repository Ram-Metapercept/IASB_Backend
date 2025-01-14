const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../public/config/db");
const TagSetB = sequelize.define(
  "IASB_Set_B_Tags",
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

// Define the Attribute model for Set B
const AttrSetB = sequelize.define(
  "IASB_Set_B_Attributes",
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
module.exports = { TagSetB, AttrSetB };
