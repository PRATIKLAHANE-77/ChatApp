const group = require("../model/group");
const usergroup = require("../model/usergroup");
const chat = require("../model/chat");
const user = require("../model/user");

exports.creategroups = async (req, res) => {
  console.log("grp created by =", req.user);
  const id = req.user.id;
  console.log("creating admin user id", id);
  console.log("check at backend", req.body.grpname);
  const newgroup = await group.create({
    groupname: req.body.grpname,
    createdBy:req.user.name,
  });
  const users = req.body.users;
  console.log("123", newgroup.id);

  for (let i = 0; i < users.length; i++) {
    usergroup.create({ groupId: newgroup.id, userId: users[i].id });
  }

  const updatedUserGroup = await usergroup.update(
    { admin: true },
    { where: { userId: id, groupId: newgroup.id } }
  );

  console.log("updatedUserGroup",updatedUserGroup);



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

exports.grpusers = async (req, res) =>{
  console.log("groupid in backend", req.params.GroupId);
  let groupid = req.params.GroupId;
  let allgrpusers = await usergroup.findAll({where:{groupId:groupid}});
  console.log("all group users id", allgrpusers);
  
  let grpusers = [];
  for(let i = 0;i<allgrpusers.length;i++) {
    let result = await user.findOne({where:{id:allgrpusers[i].userId}});
    grpusers.push(result);
   
  }
  console.log("arr of users in grp =", grpusers);
  res.status(200).json(grpusers);
}
