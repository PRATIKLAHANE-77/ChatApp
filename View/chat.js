const creategrp = document.getElementById("new-grp");
const groupform = document.getElementById("form");
const selectedUsers = [];
const userslist = document.getElementById("user-list");
const token = localStorage.getItem("token");
const grplist = document.getElementById("groupslist");
const sentmessage = document.getElementById("message-send-form");
const msglist = document.getElementById("msglist");

creategrp.addEventListener("click", () => formopen());

function formopen() {
  console.log("clicked");
  groupform.innerHTML = `<label for="grp-name">Group Name</label>
  <input id="grp-name" type="text">
  <button id="createGroupBtn" onclick="createGroup()">Create Group</button>`;
  getusers();
}

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
      getgroups();
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
  let GroupId = groupinfo.groupid;
  getUsers(groupinfo);

  let allgrpmsg = localStorage.getItem(groupinfo.groupname);
  console.log("initial localstrorage messages", allgrpmsg);
  let oldarr = [];
  let lastid = -1;
  if (allgrpmsg != null && oldarr.length >= 1) {
    oldarr = JSON.parse(allgrpmsg);
    console.log("oldarr", oldarr);
    lastid = oldarr[oldarr.length - 1].id;
    console.log("lastid", lastid);
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
    let finalarr = [...oldarr, ...newarr];
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
  <button id="send-message">Send Message</button><button  style="position: relative; left: 10px;" id="add-user">Add User</button>`;

  const Message = document.getElementById("text-message");
  const send = document.getElementById("send-message");
  const addUser = document.getElementById("add-user");

  send.addEventListener("click", (event) => {
    event.preventDefault();
    let obj = {
      message: Message.value,
      groupid: groupinfo.groupid,
    };
    msgsend(obj);
  });

  addUser.addEventListener("click", (event) => {
    event.preventDefault();
    addUsers(groupinfo);
  });
}

async function getUsers(groupinfo) {
  let GroupId = groupinfo.groupid;

  let grpusers = await axios.get(
    `http://localhost:5000/group/grpusers/${GroupId}`,
    {
      headers: { Authorization: token },
    }
  );
  console.log("all group users", grpusers);
  const groupUsersList = document.getElementById("group-users");
  groupUsersList.innerHTML = "";
  for (let i = 0; i < grpusers.data.length; i++) {
    const li = document.createElement("li");
    li.textContent = grpusers.data[i].name;
    groupUsersList.appendChild(li);
    li.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("clicked on this user name = ", li.textContent);
      let newobj = {
        groupinfo: groupinfo,
        userinfo: grpusers.data[i],
      };
      addRemove(newobj);
    });
  }
}

// let newobj = {
//   groupinfo:groupinfo,
//   userinfo:grpusers.data,
// }
// addRemove(newobj);

function addRemove(param) {
  console.log(param);
  const buttondiv = document.querySelector(".button-container");
  buttondiv.innerHTML = `<button class="admin-button">Make Admin</button>
 <button class="remove-button">Remove ${param.userinfo.name}</button>`;
  const adminbutton = document.querySelector(".admin-button");
  const removebutton = document.querySelector(".remove-button");
  adminbutton.addEventListener("click", (event) => {
    event.preventDefault();
    makeAdmin(param);
  });

  removebutton.addEventListener("click", (event) => {
    event.preventDefault();
    removeUser(param);
  });

  //  grpusers.data[i].name
}

async function makeAdmin(param) {
  console.log("param = 11111", param);
  let result = await axios.post(
    "http://localhost:5000/admin/make-admin",
    param,
    {
      headers: { Authorization: token },
    }
  );
  if (result.data.admin == true) {
    alert("make a admin of this group");
  } else {
    alert(result.data.admin);
  }
}

async function removeUser(param) {
  console.log("mike check 123 =", param);
  try {
    let result = await axios.post(
      "http://localhost:5000/admin/remove-admin",
      param,
      {
        headers: { Authorization: token },
      }
    );
    if (result.status == 200) {
      console.log("let check 77777 =", result.data);
      getUsers(result.data);
      // const buttondiv = document.querySelector(".button-container");
      // const removebutton = document.querySelector(".remove-button");
      // buttondiv.removeChild(removebutton);
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("Forbidden: Cannot remove the user because they created the group");
      // Handle the forbidden error here, for example, display a message to the user
    } else {
      console.error("Error:", error);
      // Handle other errors as needed
    }
  }
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
      groupname: result.data.groupname,
      groupid: result.data.groupid,
    };
    getgrpmessages(obj);
  }
}

async function addUsers(groupinfo) {
  console.log("remaining users are = ", groupinfo);
  let result = await axios.get("http://localhost:5000/user/remaining-users", {
    params: {
      groupinfo: groupinfo,
    },
  });

  if (result.status == 200) {
    console.log("remaining users are = ", result.data);
    let obj = {
      groupinfo: groupinfo,
      users: result.data,
    };
    displayRemainingUsers(obj);
  }
}

const clickedUsers = [];

function displayRemainingUsers(param) {
  let users = param.users;
  const remainingUsersList = document.getElementById("remaining-users-list");
  remainingUsersList.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.textContent = users[i].name;

    // Add a data attribute to store user information
    li.setAttribute("data-user-id", users[i].id);

    // Add a click event listener to handle user selection
    li.addEventListener("click", () => ToggleUserSelection(users[i]));

    remainingUsersList.appendChild(li);
  }
  const addButton = document.createElement("button");
  addButton.textContent = "Add New Users";
  addButton.className = "add-users-button"; // Apply the CSS class
  addButton.addEventListener("click", () => addUserToGroup(param.groupinfo));

  // Append the button to the container (adjust the container ID if needed)
  remainingUsersList.parentElement.appendChild(addButton);
}

function ToggleUserSelection(user) {
  console.log("remaining users adding in the array =",clickedUsers);
  const index = clickedUsers.findIndex(
    (clickedUser) => clickedUser.id === user.id
  );

  if (index === -1) {
    // User not clicked, add to the array
    clickedUsers.push(user);
  } else {
    // User already clicked, remove from the array
    clickedUsers.splice(index, 1);
  }

  console.log("Clicked users:", clickedUsers);
}

async function addUserToGroup(groupinfo) {
  let info = {
    groupinfo:groupinfo,
    users:clickedUsers
  }
  console.log("error testing 0099 = ", info);
  let result = await axios.post(
    "http://localhost:5000/user/add-new-users",
    info
  );
  if(result.status == 200) {
    console.log(result.data);
  }
}
