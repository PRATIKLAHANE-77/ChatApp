const chat = require("../model/chat");
const user = require("../model/user");
const { Op } = require('sequelize');


exports.sendmessage = async (req, res) => {
  const { message } = req.body;
  const newuser = req.user;
  const userId = newuser.id;

  console.log("user", newuser);
  console.log("message", message);
  const date = new Date();

  const newMessage = await chat.create({
    message: message,
    date: date,
    userId: userId,
  });

  const newUser = await user.findOne({ where: { id: userId } });

  if (newMessage) {
    res.status(201).json({ name: newUser.name, message: newMessage.message, date:newMessage.date });
  }
};

// exports.receivemessage = async (req, res) => {
//   const newuser = req.user;
//   const userId = newuser.id;
//   let id = req.params.id;
//   if(id == undefined) {
//     id = -1;
//   }
//   const val = id + 1;

//   const allmessage = await chat.findAll({ where: { userId: userId , id: { [Op.gt]: val } } });
//   console.log("database check added functionality", allmessage);
//   if(allmessage) {
//     res.status(200).json(allmessage)
//   }
// };


exports.receivemessage = async (req, res) => {
  try {
    const newuser = req.user;
    const userId = newuser.id;
    let msgid = req.params.msgid;
    console.log("receiving id in backend", msgid);
    console.log("user", userId);
    if(msgid == -1) {
      msgid = -1;
    }
    // const val = msgid + 1;
  
    const allmessage = await chat.findAll({ where: { userId: newuser.id, id: { [Op.gt]: msgid } } });
  
    console.log("database check added functionality", allmessage);
    
    if (allmessage) {
      res.status(200).json(allmessage);
    } else {
      res.status(404).json({ message: 'No messages found' });
    }
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  





}