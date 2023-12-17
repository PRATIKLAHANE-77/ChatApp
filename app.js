const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');
const user = require('./model/user');
const chat = require('./model/chat');
const group = require('./model/group');
const usergroup = require('./model/usergroup');
const groupRoute = require('./routes/group');
const adminRoute = require("./routes/admin");

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/user', userRoute);
app.use('/chat', messageRoute);
app.use('/group', groupRoute);
app.use('/admin', adminRoute);

user.hasMany(chat, { as: 'chats' });
chat.belongsTo(user);

group.hasMany(chat, {as:'chats'});
chat.belongsTo(group);

group.belongsToMany(user, { through: "usergroup" });
user.belongsToMany(group, { through: "usergroup" });





sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.log('Database synchronization error:', err);
  });
