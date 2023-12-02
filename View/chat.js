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
  let result = await axios.post("http://localhost:5000/chat/message", message, {
    headers: { Authorization: token },
  });

  console.log(result);
  if(result.status == 201) {
    const div = document.createElement("div");
    div.innerHTML = `<h1>${result.data.name}</h1><h1>${result.data.message}</h1>`
    div.className = "received-message";
    document.body.appendChild(div);
  }
}
