const name = document.getElementById("name");
const email = document.getElementById("email");
const number = document.getElementById("number");
const password = document.getElementById("password");
const Signup = document.getElementById("signup");
const login = document.getElementById("login");

login.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "login.html";
});

signup.addEventListener("click", (event) => {
  event.preventDefault();

  const obj = {
    name: name.value,
    email: email.value,
    password: password.value,
    number: number.value,
  };
  signupUser(obj);
});

async function signupUser(info) {
  try {
    let result = await axios.post("http://localhost:5000/user/signup", info);

    if (result.status == 201) {
      alert("User signed up successfully");
      window.location.href = "login.html";
    }
  } catch (error) {
    if (error.response.status == 400) {
      const h1 = document.createElement("h1");
      h1.innerHTML = "User Already Exists, Please Click On Login Button";
      h1.style.textAlign = "center";
      document.body.appendChild(h1);
      console.log("User already exists");
      alert("User already exists");
    } else {
      console.error("Error during signup:", error);
    }
  }
}
