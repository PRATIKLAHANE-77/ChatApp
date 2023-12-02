const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');
const user = require('./model/user');
const chat = require('./model/chat');

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/user', userRoute);
app.use('/chat', messageRoute);

user.hasMany(chat, { as: 'chats' });
chat.belongsTo(user);


user.hasMany(chat); // User can have many expenses
chat.belongsTo(user); // An expense belongs to one user

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
