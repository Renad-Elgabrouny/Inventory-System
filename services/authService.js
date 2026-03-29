import { InvalidCredentialError } from "../utils/Error handlers/InvalidCredentialError.js";
const baseUrl = "http://localhost:3000/users";

import { UserService } from "./userService.js";

async function register(userData) {

  try {

    const newUser = await UserService.createUser(userData);

    // localStorage.setItem("currentUser", JSON.stringify(newUser));

    return newUser;

  } catch (error) {

    throw error;

  }

}

async function login(email, password) {
  const response = await fetch(`${baseUrl}?email=${email}`);
  const users = await response.json();

  if (users.length === 0) {
    throw new InvalidCredentialError("Invalid email or password");
  }
  const user = users[0];
  if (user.password !== password) {
    throw new InvalidCredentialError("Invalid email or password");
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  return user;
}

function logout() {
  localStorage.removeItem("currentUser");
}

function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function isAuth() {
  return localStorage.getItem("currentUser") !== null;
}

function isAdmin() {

  const user = getCurrentUser();

  return user && user.role === "admin";
}

export const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuth,
  isAdmin
};