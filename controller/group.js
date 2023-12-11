const group = require("../model/group");
const usergroup = require("../model/usergroup");
const chat = require("../model/chat");

exports.creategroups = async (req, res) => {
  console.log("check at backend", req.body.grpname);
  const newgroup = await group.create({
    groupname: req.body.grpname,
  });
  const users = req.body.users;
  console.log("123", newgroup.id);

  for (let i = 0; i < users.length; i++) {
    usergroup.create({ groupId: newgroup.id, userId: users[i].id });
  }

  res.status(200).json(newgroup);
};

exports.groupmessages = async (req, res) => {
  console.log("group id received", req.params.grpid);
  const grpid = req.params.grpid;
  const grpmessages = await chat.findAll({ where: { groupId: grpid } });
  res.status(200).json(grpmessages);
};

exports.usergroups = async (req, res) => {
  const userid = req.user.id;
  const usergrps = await usergroup.findAll({ where: { userId: userid } });
  console.log("all id =", usergrps);
  let grouparr = [];

  for (let i = 0; i < usergrps.length; i++) {
    const grpinfo = await group.findOne({ where: { id: usergrps[i].groupId } });
    grouparr.push(grpinfo);
  }
  res.status(200).json(grouparr);
};
