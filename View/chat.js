const message = document.getElementById("message");
const button = document.getElementById("send");
const token = localStorage.getItem("token");

button.addEventListener("click", (event) => {
  event.preventDefault();
  const obj = {
    message: message.value,
  };
  sendMessage(obj);
});

async function sendMessage(message) {
  console.log(message);
  let result = await axios.post("http://localhost:5000/chat/send-message", message, {
    headers: { Authorization: token },
  });

  console.log(result);
  if (result.status == 201) {
    alert("message send sucessfully");
    refresh();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  refresh();
});

async function refresh() {
  let result = await axios.get("http://localhost:5000/chat/receive-message",{
    headers: { Authorization: token },
  });
  if(result.status == 200) {
    alert("sucessfully receiving message");
    console.log(result.data);
    const div = document.createElement("div");
    div.innerHTML = `<table><tr><th>messages</th><th>Date</th></table>`

    function formatDateString(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
      const formattedDate = new Date(dateString).toLocaleString('en-US', options);
      return formattedDate;
    }

    const array = result.data;
    array.forEach((object, index) => {
      console.log("object",object);
      const formattedDate = formatDateString(object.date);
      div.innerHTML = div.innerHTML +  `<table><tr><td>${object.message}</td><td>${formattedDate}</td></tr></table>`

    });

    document.body.appendChild(div);
  }
}
