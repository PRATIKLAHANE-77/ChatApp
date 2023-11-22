const email = document.getElementById("email");
const password = document.getElementById("password");
const login = document.getElementById("login");
const signup = document.getElementById("signup");

signup.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "signup.html";
});

login.addEventListener("click", (event) => {
  event.preventDefault();
  const obj = {
    email: email.value,
    password: password.value,
  };

  loginUser(obj);
});

async function loginUser(user) {
  try{
    let result = await axios.post("http://localhost:5000/user/login", user);
    if(result.status == 200) {
      alert("Logged in Succssfully");
    }
  }
  catch(err){
    console.log(err);
  }
}
