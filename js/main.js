import { loginInit } from "./pages/login.js";
import { registerInit } from "./pages/register.js";
import { loadDashboardWindow } from "./pages/dashboard.js";
import {bindGlobalActions} from "./pages/orders.js"
const page = window.location.pathname.split("/").pop();

if (page == "register.html") {
  registerInit();
} else if (page == "login.html") {
  loginInit();
} else if (page == "index.html") {
  loadDashboardWindow();
} else if (page == "orders.html"){
  bindGlobalActions()
}