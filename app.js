const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./util/database');
const userRoute = require('./routes/user');

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/user', userRoute);

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
