const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const usergroup = sequelize.define(
  "usergroup", // lowercase model name
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    admin:{
      type:Sequelize.BOOLEAN,
      allowNull:true,

    }
  },
  {
    tableName: "usergroup",
  }
);

module.exports = usergroup;
