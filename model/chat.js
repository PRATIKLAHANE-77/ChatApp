const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const chat = sequelize.define(
  "chat",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true, // Corrected
    },

    message: {
      type: Sequelize.TEXT, // Corrected
      allowNull: false,
      // unique:true,
    },

    date: {
      type: Sequelize.DATE, // Corrected
      allowNull: false,
    },
  },
  {
    tableName: "chat", // Specify the table name as 'model'
  }
);






module.exports = chat;

