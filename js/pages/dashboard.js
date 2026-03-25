import { AuthService } from "../../services/authService.js";
import { loadUserWindow } from "./users.js";
import { loadLogWindow } from "./activityLog.js";
// Selectors
const menu = document.querySelector(".menu");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const profile = document.querySelector(".user-profile");
const usersItem = document.querySelector(".users");
const supplierItem = document.querySelector(".supplier");

function checkRole() {
  const usr = AuthService.getCurrentUser();

  if (usr.role === "admin") {
    usersItem.classList.remove("d-none");
  } else {
    usersItem.classList.add("d-none");
  }
}


function renderUserProfile() {
  const currentUser = AuthService.getCurrentUser();
  profile.innerText = currentUser.name;
}


function checkItems() {
  menu.addEventListener("click", function (e) {
    const item = e.target.closest(".sidebar-item");

    if (!item) return;
    sidebarItems.forEach(el => el.classList.remove("active-item"));
    supplierItem.classList.remove("active-item");
    item.classList.add("active-item");

    if (item.classList.contains("users")) {
      loadUserWindow();
    }
    if (item.classList.contains("activities")) {
      loadLogWindow();
    }
  });
}


export function loadDashboardWindow() {
  checkRole();
  renderUserProfile();
  checkItems();
}