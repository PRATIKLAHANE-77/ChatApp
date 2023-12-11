const ul = document.getElementById("mainlist");
const grpname = document.getElementById("grp-name");
const token = localStorage.getItem("token");
const createdGroupsList = document.getElementById("groupsList");
const groupmessages = document.getElementById("messagelist");
const selectedUsers = [];

getusers();

async function getusers() {
  const result = await axios.get("http://localhost:5000/user/allusers");
  createlist(result.data);
}

function createlist(users) {
  for (let i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `${users[i].name}`;
    li.addEventListener("click", () => toggleUserSelection(users[i]));
    ul.appendChild(li);
  }
}

function toggleUserSelection(user) {
    const index = selectedUsers.findIndex((selectedUser) => selectedUser.id === user.id);

    if (index === -1) {
      // User not selected, add to the array
      selectedUsers.push(user);
    } else {
      // User already selected, remove from the array
      selectedUsers.splice(index, 1);
    }
  }

  function createGroup(grpname) {
    console.log("grp name", grpname);
    // console.log("users in this grp = ", selectedUsers)
    // Send selectedUsers array to the backend using axios POST request
    axios.post("http://localhost:5000/group/createGroup", { users: selectedUsers, grpname:grpname },  {
      headers: { Authorization: token },
    })
      .then((response) => {
        // Handle the response from the backend
        console.log("Group created successfully:", response.data);
        displayCreatedGroup(response.data.groupname, response.data.id);
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  }

  function displayCreatedGroup(groupname, grpid) {
    const groupItem = document.createElement("li");
    groupItem.classList.add("groupItem");
    groupItem.innerHTML = groupname;
    createdGroupsList.appendChild(groupItem);
    groupItem.addEventListener("click", () => getgrpmessages(grpid));
    
  }

  async function getgrpmessages(grpid) {
    let result = await axios.get(`http://localhost:5000/group/receivegrpmessages/${grpid}`, {
      headers: { Authorization: token },
    });
    console.log("grp message received", result);
    let array  = result.data;
    for(let i = 0;i<array.length;i++) {
      const li = document.createElement("li");
    li.innerHTML = `${array[i].message}`
    groupmessages.appendChild(li);
    }
  }
  


