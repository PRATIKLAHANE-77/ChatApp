const Sequelize = require("sequelize");
const sequelize = require("../util/database");



const group = sequelize.define(
  "group",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true, // Corrected
    },

    groupname: {
      type: Sequelize.STRING, // Corrected
      allowNull: false,
      // unique:true,
    },
    createdBy:{
      type:Sequelize.STRING,
      allowNull:false,
      
    }
  },
  {
    tableName: "group", // Specify the table name as 'model'
  }
);






module.exports = group;

