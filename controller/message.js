const chat = require("../model/chat");
const user = require("../model/user");
const group = require("../model/group");
const { Op } = require("sequelize");

exports.sendmessage = async (req, res) => {
  console.log("after sending message to backend", req.body);
  const { message } = req.body;
  const { groupid } = req.body;
  const newuser = req.user;
  const userId = newuser.id;

  console.log("user", newuser);
  console.log("message", message);
  const date = new Date();

  const newMessage = await chat.create({
    message: message,
    date: date,
    userId: userId,
    groupId: groupid,
  });

  const groupinfo = await group.findOne({where:{id:groupid}});

  const newUser = await user.findOne({ where: { id: userId } });
  let groupname = groupinfo.groupname;
  let groupID = groupinfo.id;

  if (newMessage) {
    res.status(201).json({
      name: newUser.name,
      message: newMessage.message,
      date: newMessage.date,
      groupname:groupname,
      groupid:groupID
    });
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

// running item
// exports.receivemessage = async (req, res) => {
//   try {
//     const newuser = req.user;
//     const userId = newuser.id;
//     let groupid = req.params.groupid;
//     console.log("receiving id in backend", groupid);
//     console.log("user id", userId);
//     // const val = msgid + 1;

//     console.log("database check added functionality", allmessage);

//     if (allmessage) {
//       res.status(200).json(allmessage);
//     } else {
//       res.status(404).json({ message: 'No messages found' });
//     }
//   } catch (error) {
//     console.error('Error retrieving messages:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }

// }

exports.receivemessage = async (req, res) => {
  try {
    const newuser = req.user;
    const userId = newuser.id;
    // let groupid = req.params.groupid;

    let grpid = req.query.groupid;
    let lastid = req.query.lastid;
    console.log("req.query in backend = ", req.query);
    console.log("receiving id in backend", grpid);
    console.log("user id", userId);
    // const val = msgid + 1;

    const allmessage = await chat.findAll({
      where: { groupId: grpid, id: { [Op.gt]: lastid } },
    });

    // console.log("in a group all messages", allmessage);

    if (allmessage) {
      res.status(200).json(allmessage);
    } else {
      res.status(404).json({ message: "No messages found" });
    }
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// let grpid = req.body.groupId;
// let lastid = req.body.lastId;
//     // const allmessage = await chat.findAll({ where: { userId: newuser.id, id: { [Op.gt]: msgid } } });

// const grpmessages = await chat.findAll({ where: { groupId: grpid, id: { [Op.gt]: lastid }} });
