import { UserService } from "../../services/userService.js";
import { initModal, openModal, closeModal } from "../components/modal.js";
import { AuthService } from "../../services/authService.js";
// Selectors
const dashboard = document.querySelector(".dashboard");
const users = document.querySelector(".users");
const report = document.querySelector(".report");
const logs = document.querySelector(".activities");
const search = document.querySelector(".search");
const sidebarItems = document.querySelectorAll(".sidebar-item span");
let deleteUsers = null; // will be updated later inside a function after rendering it 
let editUsers = null;
let totalUsers = null;
let totalAdmins = null;
let addUsers = null;
let tbody = null;
const profile = document.querySelector(".user-profile");


// global all users so that it can be used across all functions
let allUsers = [];

function reselectElements() {
  totalUsers = document.querySelector(".total-u h5");
  totalAdmins = document.querySelector(".total-a h5");
  addUsers = document.querySelector(".add-user");
  tbody = document.querySelector("tbody");
}// make them in a function so that i can reselect then after rendering the contentArea content

async function renderAreaContent() {
  const res = await fetch("../../pages/users.html");
  const html = await res.text();
  document.querySelector(".contentArea").innerHTML = html;
}// display the outer strucutre of the area content (user page without data)

function renderUsers(allUsers) {
  tbody.innerHTML = "";
  allUsers.forEach(usr => {
    let row = document.createElement("tr");
    // i made the condition as each role has its color badge
    if (usr.role == "user") {
      row.innerHTML = `
  <td>${usr.name}</td>
                    <td>${usr.email}</td>
                    <td>${usr.password}</td>
                    <td><span class="badge text-bg-secondary">${usr.role}</span></td>
                    <td>
                      <i class="fa-solid fa-pen me-3 actions edit-user" userId="${usr.id}"></i
                      ><i
                        class="fa-regular fa-trash-can actions delete-user" userId="${usr.id}"
                      ></i>
                    </td>
  `;
    }
    else {
      row.innerHTML = `
  <td>${usr.name}</td>
                    <td>${usr.email}</td>
                    <td>${usr.password}</td>
                    <td><span class="badge text-bg-info">${usr.role}</span></td>
                    <td>
                      <i class="fa-solid fa-pen me-3 actions edit-user" userId="${usr.id}"></i
                      ><i
                        class="fa-regular fa-trash-can actions delete-user" userId="${usr.id}"
                      ></i>
                    </td>
  `;
    }
    tbody.appendChild(row);
  });
  editUsers = document.querySelectorAll(".edit-user");
  deleteUsers = document.querySelectorAll(".delete-user");
}// this function will load the data from json to table rows

function setUpSearch(value) {
  let filteredUsers = allUsers;
  if (!value) return allUsers;
  if (value) {
    const searchLower = value.toLowerCase();

    filteredUsers = allUsers.filter((user) => {
      return Object.values(user).some((value) => {
        return String(value).toLowerCase().includes(searchLower);
      });
    });
    return filteredUsers;
  };
}// this function take value and filter the data based on it 
function searchUsers() {
  search.addEventListener("input", (e) => {
    const searchValue = e.target.value.trim();
    const filtered = setUpSearch(searchValue);
    console.log(filtered);
    renderUsers(filtered);
  });
}// used to get the input user in search and pass it to SetUpSearch function

function setupCards() {
  let filteredUsers = allUsers.filter(usr => usr.role.toLowerCase() === "user");
  let filteredAdmins = allUsers.filter(usr => usr.role.toLowerCase() === "admin").length;

  totalUsers.innerText = filteredUsers.length;
  totalAdmins.innerText = filteredAdmins;

  console.log("Users:", filteredUsers);
  console.log("Admins:", filteredAdmins);
}// used to render the total numbers of admins and users in the cards


function setupAddUser() {
  addUsers.addEventListener("click", () => {
    const formHTML = `
      <form id="userForm">
      <div id="form-error" class="text-danger small mb-2"></div>
        <input name="name" class="form-control mb-2" placeholder="Name" required />
        <input name="email" class="form-control mb-2" placeholder="Email" required />
        <input name="password" type="password" class="form-control mb-2" placeholder="Password" required />
        <select name="role" class="form-select mb-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </form>
    `;

    const modal = openModal("Add User", formHTML);

    const form = modal.querySelector("#userForm");
    const submitBtn = modal.querySelector(".submit");
    const errorDiv = modal.querySelector("#form-error");

    submitBtn.onclick = async () => {
      errorDiv.textContent = ""; // reset

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());

      try {
        const newUser = await UserService.createUser(userData);
        allUsers.push(newUser);
        renderUsers(allUsers);
        setupCards();
        closeModal();
      } catch (err) {
        errorDiv.textContent = err.message || "Something went wrong";
      }
    };
  });
}

function setupEditUser() {
  tbody.addEventListener("click", (e) => {
    if (!e.target.classList.contains("edit-user")) return;

    const userId = e.target.getAttribute("userId");
    const user = allUsers.find(u => u.id == userId);

    const formHTML = `
      <form id="userForm">
      <div id="form-error" class="text-danger small mb-2"></div>
        <input name="name" value="${user.name}" class="form-control mb-2" required />
        <input name="email" value="${user.email}" class="form-control mb-2" required />
        <input name="password" value="${user.password}" class="form-control mb-2" required />
        <select name="role" class="form-select mb-2">
          <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </form>
    `;

    const modal = openModal("Edit User", formHTML);

    const form = modal.querySelector("#userForm");
    const submitBtn = modal.querySelector(".submit");
    const errorDiv = modal.querySelector("#form-error");

    submitBtn.onclick = async () => {
      errorDiv.textContent = "";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());

      try {
        const updatedUser = await UserService.updateUser(userId, userData);

        const index = allUsers.findIndex(u => u.id == userId);
        allUsers[index] = updatedUser;

        renderUsers(allUsers);
        setupCards();
        closeModal();
      } catch (err) {
        errorDiv.textContent = err.message || "Failed to update user";
      }
    };
  });
}

function setupDeleteUser() {
  tbody.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-user")) return;

    const userId = e.target.getAttribute("userId");
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await UserService.deleteUser(userId);
      allUsers = allUsers.filter(u => u.id != userId);
      renderUsers(allUsers);
      setupCards();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete user");
    }
  });
}

export async function loadUserWindow() {
  try {
    await renderAreaContent();
    reselectElements();
    await initModal();
    allUsers = await UserService.getAllUsers();
    setupCards();
    renderUsers(allUsers);
    searchUsers();
    setupAddUser();
    setupEditUser();
    setupDeleteUser();
  } catch (err) {
    console.error(err);
  }

}// this function that collect calling all the function built above
// loadUserWindow();