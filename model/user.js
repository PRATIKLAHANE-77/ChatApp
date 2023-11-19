const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const user = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true, // Corrected
    },

    name: {
      type: Sequelize.STRING, // Corrected
      allowNull: false,
      // unique:true,
    },

    email: {
      type: Sequelize.STRING, // Corrected
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING, // Corrected
      allowNull: false,
      // unique:true,
    },
    number: {
      type:Sequelize.INTEGER,
      allowNull:false,
    },
  },
  {
    tableName: "user", // Specify the table name as 'model'
  }
);






module.exports = user;

