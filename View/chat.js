const creategrp = document.getElementById("new-grp");
const groupform = document.getElementById("form");
const selectedUsers = [];
const userslist = document.getElementById("user-list");
const token = localStorage.getItem("token");
const grplist = document.getElementById("groupslist");
const sentmessage = document.getElementById("message-send-form");
const msglist = document.getElementById("msglist");

creategrp.addEventListener("click", () => formopen());

async function getusers() {
  userslist.textContent = "";
  const result = await axios.get("http://localhost:5000/user/allusers");
  createlist(result.data);
}

function createlist(users) {
  for (let i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.textContent = "";
    li.innerHTML = `${users[i].name}`;
    li.addEventListener("click", () => toggleUserSelection(users[i]));
    userslist.appendChild(li);
  }
}

function toggleUserSelection(user) {
  const index = selectedUsers.findIndex(
    (selectedUser) => selectedUser.id === user.id
  );

  if (index === -1) {
    // User not selected, add to the array
    selectedUsers.push(user);
  } else {
    // User already selected, remove from the array
    selectedUsers.splice(index, 1);
  }
}

function formopen() {
  console.log("clicked");
  groupform.innerHTML = `<label for="grp-name">Group Name</label>
  <input id="grp-name" type="text">
  <button id="createGroupBtn" onclick="createGroup()">Create Group</button>`;
  getusers();
}

function createGroup() {
  console.log(selectedUsers);
  const grpname = document.getElementById("grp-name").value;
  groupform.innerHTML = "";
  console.log("grp name", grpname);
  axios
    .post(
      "http://localhost:5000/group/createGroup",
      { users: selectedUsers, grpname: grpname },
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      selectedUsers.length = 0;
      // Handle the response from the backend
      console.log("Group created successfully:", response.data);
      // const param = [];
      // param.push(response.data);
      getgroups();

      // displayCreatedGroup(response.data.groupname, response.data.id);
    })
    .catch((error) => {
      console.error("Error creating group:", error);
    });
}

window.addEventListener("DOMContentLoaded", async () => {
  getgroups();
});

async function getgroups() {
  grplist.textContent = "";
  let result = await axios.get(`http://localhost:5000/group/usergroups`, {
    headers: { Authorization: token },
  });
  console.log("member included in this grps = ", result.data);
  showgrps(result.data);
}

function showgrps(array) {
  console.log("check at frontend", array);
  for (let i = 0; i < array.length; i++) {
    const li = document.createElement("li");
    // li.textContent = "";
    li.textContent = array[i].groupname;
    console.log("group names = ", array[i].groupname);
    grplist.appendChild(li);
    li.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("group name clicked = ", li.textContent, array[i].id);
      let groupname = li.textContent;
      let groupid = array[i].id;
      let obj = {
        groupname: groupname,
        groupid: groupid,
      };
      getgrpmessages(obj);
    });
  }
}

async function getgrpmessages(groupinfo) {
  let allgrpmsg = localStorage.getItem(groupinfo.groupname);
  console.log("initial localstrorage messages", allgrpmsg);
  let oldarr = [];
  let lastid = -1;
  if(allgrpmsg != null) {
    oldarr = JSON.parse(allgrpmsg);
    console.log("oldarr", oldarr);
     lastid = oldarr[oldarr.length-1].id;
    console.log("lastid",lastid);
  }

  let groupid = groupinfo.groupid;
  let result = await axios.get(
    `http://localhost:5000/chat/receive-message?groupid=${groupid}&lastid=${lastid}`,
    {
      headers: { Authorization: token },
    }
  );

  if (result.status == 200) {
    console.log("all messages", result.data);
    let newarr = result.data;
    console.log("new array received", newarr);
    // let OLDARR = JSON.stringify(oldarr);
    let finalarr = [...oldarr,...newarr];
    // let FinalArr = JSON.parse(finalarr);
    console.log("finalarr", finalarr);
    if (finalarr.length > 10) {
      while (finalarr.length == 10) {
        finalarr.shift();
      }
    }
    localStorage.setItem(groupinfo.groupname, JSON.stringify(finalarr));
    msglist.innerHTML = "";
    for (let i = 0; i < finalarr.length; i++) {
      const li = document.createElement("li");
      li.textContent = finalarr[i].message + finalarr[i].date;
      msglist.appendChild(li);
    }
  }

  sentmessage.innerHTML = ` <h2>Send Message</h2>
  <label for="text-message">Message</label>
  <input id="text-message" type="text" />
  <button id="send-message">Send Message</button>`;

  const Message = document.getElementById("text-message");
  const send = document.getElementById("send-message");

  send.addEventListener("click", (event) => {
    event.preventDefault();
    let obj = {
      message: Message.value,
      groupid: groupinfo.groupid,
    };
    msgsend(obj);
  });
}

async function msgsend(info) {
  console.log("info before sending", info);
  let result = await axios.post(
    "http://localhost:5000/chat/send-message",
    info,
    {
      headers: { Authorization: token },
    }
  );
  if (result.status == 201) {
    alert(result.data);
    console.log("info", result.data);
    let obj = {
      groupname:result.data.groupname,
      groupid:result.data.groupid
    }
    getgrpmessages(obj);
  }
}
