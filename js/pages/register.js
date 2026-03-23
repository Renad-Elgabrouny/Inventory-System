import { AuthService } from "../../services/authService.js";
// selectors
const userName = document.querySelector(".user-name-register");
const userEmail = document.querySelector(".user-email-register");
const userPassword = document.querySelector(".user-pass-register");
const submit = document.querySelector(".register");
const login = document.querySelector(".login");
const nameError = document.querySelector(".name-error");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");


submit.addEventListener("click", async function (e) {
  e.preventDefault();

  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  try {
    const userData = {
      name: userName.value,
      email: userEmail.value,
      password: userPassword.value
    };

    const res = await AuthService.register(userData);
    window.location.href = "index.html";

  } catch (error) {
    console.log(error);

    if (error.errors && error.errors.length > 0) {
      error.errors.forEach(err => {
        if (err.param == "name") {
          nameError.textContent = err.msg;
        }

        if (err.param == "password") {
          passwordError.textContent = err.msg;
        }

        if (err.param == "email") {
          emailError.textContent = err.msg;
        }
      });
    } else {
      console.log(error.message);
    }
  }
});

