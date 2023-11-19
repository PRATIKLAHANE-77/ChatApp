const name = document.getElementById("name");
const email = document.getElementById("email");
const number = document.getElementById("number");
const password = document.getElementById("password");
const Signup = document.getElementById("signup");

signup.addEventListener("click", (event) => {
  event.preventDefault();

  const obj = {
    name: name.value,
    email: email.value,
    password: password.value,
    number: number.value,
  };
  postdata(obj);
});

async function postdata(info) {
    let result = await axios.post("http://localhost:5000/user/signup",info);
    console.log(result);
}
