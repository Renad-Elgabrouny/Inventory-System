import { ActivityService } from "../../services/activityLogService.js";
import { AuthService } from "../../services/authService.js";
import { UserService } from "../../services/userService.js";

// Selectors
const search = document.querySelector(".search");
let deleteUsers = null; // will be updated later inside a function after rendering it 
let tbody = null;


// global all users so that it can be used across all functions
let allLogs = [];
let allUsers = [];

function reselectElements() {
  tbody = document.querySelector("tbody");
}// make them in a function so that i can reselect then after rendering the contentArea content

async function renderAreaContent() {
  const res = await fetch("../../pages/activityLog.html");
  const html = await res.text();
  document.querySelector(".contentArea").innerHTML = html;
}// display the outer strucutre of the area content (user page without data)

function renderLogs(allLogs) {
  tbody.innerHTML = "";

  allLogs.forEach(elm => {
    let row = document.createElement("tr");
    let user = allUsers.find(u => u.id === elm.userId);

    row.innerHTML = `
<td>${elm.action}</td>
                    <td>${elm.entity}</td>
                    <td>${user.name}</td>
                    <td>${elm.date}</td>
                    <td>
                      <i
                        class="fa-regular fa-trash-can actions delete-user" logId="${elm.id}"
                      ></i>
                    </td>
  `;

    tbody.appendChild(row);
  });
  deleteUsers = document.querySelectorAll(".delete-user");
}// this function will load the data from json to table rows

function setUpSearch(value) {
  let filteredUsers = allLogs;
  if (!value) return allLogs;
  if (value) {
    const searchLower = value.toLowerCase();

    filteredUsers = allLogs.filter((user) => {
      return Object.values(user).some((value) => {
        return String(value).toLowerCase().includes(searchLower);
      });
    });
    return filteredUsers;
  };
}// this function take value and filter the data based on it 
function searchLogs() {
  search.addEventListener("input", (e) => {
    const searchValue = e.target.value.trim();
    const filtered = setUpSearch(searchValue);
    console.log(filtered);
    renderLogs(filtered);
  });
}// used to get the input user in search and pass it to SetUpSearch function


function setupDeleteUser() {
  tbody.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-user")) return;

    const logId = e.target.getAttribute("logId");
    console.log("Log id is", logId)
    const confirmed = confirm("Are you sure you want to delete this Log?");
    if (!confirmed) return;

    try {
      await ActivityService.deleteActivity(logId);
      allLogs = allLogs.filter(u => u.id != logId);
      renderLogs(allLogs);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete user");
    }
  });
}

export async function loadLogWindow() {
  try {
    await renderAreaContent();
    reselectElements();
    allLogs = await ActivityService.getAllActivities();
    allUsers = await UserService.getAllUsers();
    renderLogs(allLogs);
    searchLogs();
    setupDeleteUser();
  } catch (err) {
    console.error(err);
  }

}// this function that collect calling all the function built above
// loadUserWindow();