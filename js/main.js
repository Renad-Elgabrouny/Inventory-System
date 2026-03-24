import { loginInit } from "./pages/login.js";
import { registerInit } from "./pages/register.js";
import { loadUserWindow } from "./pages/users.js";

const page = window.location.pathname.split("/").pop();

if (page == "register.html") {
  registerInit();
} else if (page == "login.html") {
  loginInit();
} else if (page == "users.html") {
  loadUserWindow();
}