const message = document.getElementById("message");
const button = document.getElementById("send");
const token = localStorage.getItem("token");

// setInterval(() => localStorage(), 1000);

button.addEventListener("click", (event) => {
  event.preventDefault();
  const obj = {
    message: message.value,
  };
  sendMessage(obj);
});

async function sendMessage(message) {
  let result = await axios.post(
    "http://localhost:5000/chat/send-message",
    message,
    {
      headers: { Authorization: token },
    }
  );

  console.log("message sended", result);
  if (result.status == 201) {
    alert("message send sucessfully");
    messagesended(result);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  localdata();
});

const div = document.createElement("div");
div.innerHTML = `<table><tr><th>messages</th><th>Date</th></tr></table>`;

async function localdata() {
  div.innerHTML = "";
  div.innerHTML = `<table><tr><th>messages</th><th>Date</th></tr></table>`;
  const getmessages = localStorage.getItem("messages");
  console.log("getmessages", getmessages);
  let msgid = -1;
  const msgarray = JSON.parse(getmessages);
  console.log("msgarray", msgarray);
  if (msgarray != null && msgarray.length != 0) {
    console.log("inside if blog");
    msgid = msgarray[msgarray.length - 1].id;
    console.log("id", msgid);
  }
  console.log("msgid", msgid);

  let result = await axios.get(
    `http://localhost:5000/chat/receive-message/${msgid}`,
    {
      headers: { Authorization: token },
    }
  );
  if (result.status == 200) {
    let newmessages = [];
    console.log("result.data after refreshing =", result.data);
    let array = result.data;
    array.forEach((object, index) => {
      // messages.push(object.message + " " + object.date);  add time later
      newmessages.push({
        message: object.message,
        date: object.date,
        id: object.id,
      });
    });
    let newarr = [];
    console.log("newmessage", newmessages);
    if (msgarray != null) {
      newarr = [...msgarray, ...newmessages];
    } else {
      newarr = [...newmessages];
    }

    console.log("final array length = ", newarr.length);
    if (newarr.length > 10) {
      // console.log("inside removing of extra messages");
      // for (let i = 0; i <= newarr.length; i++) {
      //   newarr.pop();
      //   if(newarr.length == 10) {
      //     break;
      //   }
      // }
      while(newarr.length>10) {
        newarr.shift();
      }
    }

    console.log("newarr", newarr);

    localStorage.setItem("messages", JSON.stringify(newarr));
    const stringdata = localStorage.getItem("messages");
    const finaldata = JSON.parse(stringdata);
    finaldata.forEach((object, index) => {
      div.innerHTML += `<table><tr><td>${object.message}</td><td>${object.date}</td></tr></table>`;
    });
    document.body.appendChild(div);
  }
}

async function messagesended(param) {
  let newmsg = [];
  newmsg.push(param.data);
  div.innerHTML = "";
  div.innerHTML = `<table><tr><th>messages</th><th>Date</th></tr></table>`;
  // localdata();
  const stringdata = localStorage.getItem("messages");
  const finaldata = JSON.parse(stringdata);
  let arr = [];
  arr = [...finaldata, ...newmsg];
  console.log("before delete arr", arr);
if(arr.length > 10) {
while(arr.length>10) {
  arr.shift();
}
} 
console.log("after delete array" , arr);
  arr.forEach((object, index) => {
    div.innerHTML += `<table><tr><td>${object.message}</td><td>${object.date}</td></tr></table>`;
  });
  // finaldata.forEach((object, index) => {
  //   div.innerHTML += `<table><tr><td>${object.message}</td><td>${object.date}</td></tr></table>`;
  // });
  // div.innerHTML += `<table><tr><td>${param.data.message}</td><td>${param.data.date}</td></tr></table>`;
  document.body.appendChild(div);
}
