const chat = require("../model/chat");
const user = require("../model/user");

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
    res.status(201).json({ name: newUser.name, message: newMessage.message });
  }
};

exports.receivemessage = async (req, res) => {
  const newuser = req.user;
  const userId = newuser.id;

  const allmessage = await chat.findAll({ where: { userId: userId } });
  if(allmessage) {
    res.status(200).json(allmessage)
  }
};
