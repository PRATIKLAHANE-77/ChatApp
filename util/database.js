const Sequelize = require("sequelize");
const env = require("../.env");
const pass = env.password;


const sequelize = new Sequelize("chatapp", "root", `${pass}`, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
