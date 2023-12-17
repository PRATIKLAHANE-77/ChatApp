const usergroup = require("../model/usergroup");
const group = require("../model/group");
const user = require("../model/user");

exports.makeadmin = async (req, res) => {
  console.log("user we have to make admin info of that =", req.body);
  const groupid = req.body.groupinfo.groupid;
  const userid = req.body.userinfo.id;
  let mainadmin = req.user.id;
  let adminstatus = await usergroup.findOne({
    where: { groupId: groupid, userId: mainadmin },
    attributes: ["admin"],
  });
  console.log("admin status =", adminstatus);
  if (adminstatus.dataValues.admin == true) {
    let result = await usergroup.update(
      { admin: true },
      {
        where: {
          groupId: groupid, // Assuming you have groupId and userId variables
          userId: userid,
        },
      }
    );
    console.log("after making admin then", result);
    return res.status(200).json({ admin: true });
  }
  res.status(200).json({ admin: false });
};


exports.removeAdmin = async (req,res) =>{
  console.log("for removing admin info from frontend", req.body);
  let groupId = req.body.groupinfo.groupid;
  let userId = req.body.userinfo.id;

  let result = await usergroup.findOne({where:{groupId:groupId, userId:userId}});
  let userinfo = await user.findOne({where:{id:result.userId}});
  let check = await group.findOne({where:{createdBy:userinfo.name}});
  if(check) {
    return res.status(403).json({ error: 'Cannot remove the user because they created the group' });  }

  console.log("to remove user =", result);
  
if (result) {
  await result.destroy();
  console.log(`User removed from group successfully`);
  res.status(200).json(req.body.groupinfo);
} else {
  res.status(200).json(`you cant remove founder of a group`);
  console.log(`User not found in the group`);
}

}
