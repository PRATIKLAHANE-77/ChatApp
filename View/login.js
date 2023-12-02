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
      // console.log(result.data.token);
      alert("Logged in Succssfully");
      localStorage.setItem('token', result.data.token);
      window.location.href = "chat.html";
    }
  }
  catch(err){
    console.log(err);
    const h1 = document.createElement("h1");
    h1.innerHTML = "Something Went Wrong, Check Email or Password";
    h1.style.textAlign = "center";
    document.body.appendChild(h1);
  }
}
