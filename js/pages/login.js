import { AuthService } from "../../services/authService.js";
// selectors
const userName = document.querySelector(".email-user-login");
const userPassword = document.querySelector(".pass-user-login");
const submit = document.querySelector(".login");
const register = document.querySelector(".register");
const loginError = document.querySelector(".login-error");

export function loginInit() {
  submit.addEventListener("click", async function (e) {
    e.preventDefault();

    loginError.textContent = "";

    try {
      const res = await AuthService.login(userName.value, userPassword.value);
      if (res.role == "admin") {
        window.location.href = "./pages/users.html";
      } else {
        window.location.href = "index.html";
      }

    } catch (error) {
      console.log(error);

      if (error.errors && error.errors.length > 0) {
        loginError.textContent = error.errors[0].msg;
      } else {
        console.log(error.message);
      }
    }
  });
  register.addEventListener("click", () => {
    window.location.href = "register.html"
  });

}