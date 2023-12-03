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
div.innerHTML =`<table><tr><th>messages</th><th>Date</th></tr></table>`

async function localdata() {
  let result = await axios.get("http://localhost:5000/chat/receive-message", {
    headers: { Authorization: token },
  });
  if (result.status == 200) {
    let messages = [];
    console.log(result.data);
    let array = result.data;
    array.forEach((object, index) => {
      // messages.push(object.message + " " + object.date);  add time later
      messages.push({message:object.message, date:object.date});
    });

    localStorage.setItem("messages", JSON.stringify(messages));
    const data = localStorage.getItem("messages");
    console.log("data", data);
    const finaldata = JSON.parse(data);
    console.log("finaldata", finaldata);
    finaldata.forEach((object, index) => {
      div.innerHTML += `<table><tr><td>${object.message}</td><td>${object.date}</td></tr></table>`;

    });
    document.body.appendChild(div);
  }
}

async function messagesended(param) {
  div.innerHTML += `<table><tr><td>${param.data.message}</td><td>${param.data.date}</td></tr></table>`;
}
